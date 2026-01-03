import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AstrologyService } from '../astrology/astrology.service';
import {
  StartOnboardingDto,
  OnboardingSessionDto,
  OnboardingProgressDto,
  CompleteOnboardingDto,
  OnboardingCompleteResponseDto,
  OnboardingStepConfig,
  OnboardingStepData,
} from './dto/onboarding-data.dto';
import { NatalChart } from '../astrology/types/zodiac.types';

/**
 * In-memory session storage for onboarding
 * In production, use Redis or database
 */
interface OnboardingSession {
  sessionId: string;
  deviceId?: string;
  locale: string;
  currentStep: number;
  data: Partial<OnboardingStepData>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Onboarding service handling user registration flow
 */
@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  // In-memory session storage (use Redis in production)
  private sessions: Map<string, OnboardingSession> = new Map();

  // Define onboarding steps
  private readonly steps: OnboardingStepConfig[] = [
    {
      step: 1,
      name: 'name',
      title: 'What is your name?',
      description: 'Enter your name so we can personalize your experience',
      required: true,
    },
    {
      step: 2,
      name: 'gender',
      title: 'What is your gender?',
      description: 'This helps us provide more accurate readings',
      required: true,
    },
    {
      step: 3,
      name: 'birthDate',
      title: 'When were you born?',
      description: 'Your birth date determines your sun sign',
      required: true,
    },
    {
      step: 4,
      name: 'birthDetails',
      title: 'Birth time and place',
      description: 'Optional: For more accurate moon sign and ascendant',
      required: false,
    },
    {
      step: 5,
      name: 'interests',
      title: 'What interests you?',
      description: 'Help us personalize your daily horoscopes',
      required: false,
    },
  ];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly astrologyService: AstrologyService,
  ) {
    // Clean up old sessions every hour
    setInterval(() => this.cleanupSessions(), 60 * 60 * 1000);
  }

  /**
   * Start a new onboarding session
   */
  startSession(dto: StartOnboardingDto): OnboardingSessionDto {
    const sessionId = uuidv4();

    const session: OnboardingSession = {
      sessionId,
      deviceId: dto.deviceId,
      locale: dto.locale || 'en',
      currentStep: 1,
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    this.logger.log(`Onboarding session started: ${sessionId}`);

    return {
      sessionId,
      currentStep: 1,
      totalSteps: this.steps.length,
      steps: this.steps,
    };
  }

  /**
   * Save onboarding progress
   */
  saveProgress(dto: OnboardingProgressDto): OnboardingSessionDto {
    const session = this.sessions.get(dto.sessionId);

    if (!session) {
      throw new NotFoundException('Onboarding session not found');
    }

    // Validate step progression
    if (dto.step < 1 || dto.step > this.steps.length) {
      throw new BadRequestException('Invalid step number');
    }

    // Merge data
    session.data = {
      ...session.data,
      ...dto.data,
    };
    session.currentStep = Math.max(session.currentStep, dto.step + 1);
    session.updatedAt = new Date();

    this.sessions.set(dto.sessionId, session);
    this.logger.log(`Onboarding progress saved: ${dto.sessionId}, step ${dto.step}`);

    return {
      sessionId: session.sessionId,
      currentStep: session.currentStep,
      totalSteps: this.steps.length,
      steps: this.steps,
    };
  }

  /**
   * Get current session state
   */
  getSession(sessionId: string): OnboardingSessionDto & { data: Partial<OnboardingStepData> } {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new NotFoundException('Onboarding session not found');
    }

    return {
      sessionId: session.sessionId,
      currentStep: session.currentStep,
      totalSteps: this.steps.length,
      steps: this.steps,
      data: session.data,
    };
  }

  /**
   * Complete onboarding and create user
   */
  async completeOnboarding(dto: CompleteOnboardingDto): Promise<OnboardingCompleteResponseDto> {
    const session = this.sessions.get(dto.sessionId);

    if (!session) {
      throw new NotFoundException('Onboarding session not found');
    }

    // Validate required data
    if (!session.data.name) {
      throw new BadRequestException('Name is required');
    }
    if (!session.data.gender) {
      throw new BadRequestException('Gender is required');
    }
    if (!session.data.birthDate) {
      throw new BadRequestException('Birth date is required');
    }

    // Check if email already exists
    if (dto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }
    }

    // Calculate natal chart
    const natalChart = this.astrologyService.calculateNatalChart({
      birthDate: session.data.birthDate,
      birthTime: session.data.birthTime,
      birthPlace: session.data.birthPlace,
    });

    // Create user through auth service
    const authResponse = await this.authService.register({
      email: dto.email,
      password: dto.password,
      name: session.data.name,
      gender: session.data.gender,
      birthDate: session.data.birthDate,
      birthTime: session.data.birthTime,
      birthPlace: session.data.birthPlace,
      interests: session.data.interests,
      quizAnswers: session.data.quizAnswers,
    });

    // Update user with natal chart
    const user = await this.userRepository.findOne({
      where: { id: authResponse.user.id },
    });
    if (user) {
      user.natalChart = natalChart;
      await this.userRepository.save(user);
    }

    // Clean up session
    this.sessions.delete(dto.sessionId);
    this.logger.log(`Onboarding completed: ${dto.sessionId}, user ${authResponse.user.id}`);

    return {
      success: true,
      userId: authResponse.user.id,
      accessToken: authResponse.accessToken,
      sunSign: natalChart.sunSign,
      moonSign: natalChart.moonSign,
      ascendant: natalChart.ascendant,
    };
  }

  /**
   * Clean up expired sessions (older than 24 hours)
   */
  private cleanupSessions(): void {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.sessions) {
      if (now.getTime() - session.createdAt.getTime() > maxAge) {
        this.sessions.delete(sessionId);
        this.logger.log(`Cleaned up expired session: ${sessionId}`);
      }
    }
  }
}
