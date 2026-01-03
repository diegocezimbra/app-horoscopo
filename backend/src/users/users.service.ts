import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto, UserProfileDto } from './dto/update-profile.dto';
import { getZodiacSignFromDate, NatalChart } from '../astrology/types/zodiac.types';

/**
 * Users service handling user profile operations
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Get user profile with astrological data
   */
  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.findById(userId);
    const natalChart = user.natalChart as NatalChart | null;

    return {
      id: user.id,
      email: user.email || '',
      name: user.name,
      gender: user.gender,
      birthDate: user.birthDate,
      birthTime: user.birthTime,
      birthPlace: user.birthPlace,
      interests: user.interests || [],
      sunSign: getZodiacSignFromDate(new Date(user.birthDate)),
      moonSign: natalChart?.moonSign || null,
      ascendant: natalChart?.ascendant || null,
      subscriptionTier: user.subscriptionTier,
      createdAt: user.createdAt,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<UserProfileDto> {
    const user = await this.findById(userId);

    // Update fields
    if (updateDto.name !== undefined) user.name = updateDto.name;
    if (updateDto.gender !== undefined) user.gender = updateDto.gender;
    if (updateDto.birthDate !== undefined) user.birthDate = new Date(updateDto.birthDate);
    if (updateDto.birthTime !== undefined) user.birthTime = updateDto.birthTime;
    if (updateDto.birthPlace !== undefined) user.birthPlace = updateDto.birthPlace;
    if (updateDto.interests !== undefined) user.interests = updateDto.interests;
    if (updateDto.quizAnswers !== undefined) user.quizAnswers = updateDto.quizAnswers;

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`Profile updated for user: ${userId}`);

    return this.getProfile(savedUser.id);
  }

  /**
   * Update user natal chart
   */
  async updateNatalChart(userId: string, natalChart: NatalChart): Promise<User> {
    const user = await this.findById(userId);
    user.natalChart = natalChart;

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`Natal chart updated for user: ${userId}`);

    return savedUser;
  }

  /**
   * Update user subscription tier
   */
  async updateSubscriptionTier(
    userId: string,
    tier: 'free' | 'premium' | 'ultimate',
  ): Promise<User> {
    const user = await this.findById(userId);
    user.subscriptionTier = tier;

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`Subscription updated for user ${userId}: ${tier}`);

    return savedUser;
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.userRepository.remove(user);
    this.logger.log(`Account deleted: ${userId}`);
  }

  /**
   * Get all users (admin only)
   */
  async findAll(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }
}
