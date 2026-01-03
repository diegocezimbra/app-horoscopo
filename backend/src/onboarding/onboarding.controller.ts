import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import {
  StartOnboardingDto,
  OnboardingSessionDto,
  OnboardingProgressDto,
  CompleteOnboardingDto,
  OnboardingCompleteResponseDto,
} from './dto/onboarding-data.dto';

/**
 * Onboarding controller
 * Handles user registration flow through multiple steps
 */
@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Start a new onboarding session
   */
  @Post('start')
  @ApiOperation({ summary: 'Start a new onboarding session' })
  @ApiResponse({
    status: 201,
    description: 'Onboarding session created',
    type: OnboardingSessionDto,
  })
  startOnboarding(@Body() dto: StartOnboardingDto): OnboardingSessionDto {
    return this.onboardingService.startSession(dto);
  }

  /**
   * Get current session state
   */
  @Get(':sessionId')
  @ApiOperation({ summary: 'Get current onboarding session state' })
  @ApiParam({
    name: 'sessionId',
    description: 'Session ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Session state',
    type: OnboardingSessionDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSession(@Param('sessionId') sessionId: string) {
    return this.onboardingService.getSession(sessionId);
  }

  /**
   * Save onboarding progress
   */
  @Post('progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save onboarding step progress' })
  @ApiResponse({
    status: 200,
    description: 'Progress saved',
    type: OnboardingSessionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  saveProgress(@Body() dto: OnboardingProgressDto): OnboardingSessionDto {
    return this.onboardingService.saveProgress(dto);
  }

  /**
   * Complete onboarding and create user account
   */
  @Post('complete')
  @ApiOperation({ summary: 'Complete onboarding and create user account' })
  @ApiResponse({
    status: 201,
    description: 'Onboarding completed, user created',
    type: OnboardingCompleteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Missing required data' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async completeOnboarding(@Body() dto: CompleteOnboardingDto): Promise<OnboardingCompleteResponseDto> {
    return this.onboardingService.completeOnboarding(dto);
  }
}
