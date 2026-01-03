import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for starting a new onboarding session
 */
export class StartOnboardingDto {
  @ApiPropertyOptional({
    description: 'Optional device identifier for session tracking',
    example: 'device-uuid-12345',
  })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'User locale for personalization',
    example: 'pt-BR',
  })
  @IsString()
  @IsOptional()
  locale?: string;
}

/**
 * Response DTO for onboarding session start
 */
export class OnboardingSessionDto {
  @ApiProperty({
    description: 'Session ID for tracking progress',
    example: 'session-uuid-12345',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Current step number',
    example: 1,
  })
  currentStep: number;

  @ApiProperty({
    description: 'Total number of steps',
    example: 5,
  })
  totalSteps: number;

  @ApiProperty({
    description: 'Steps configuration',
  })
  steps: OnboardingStepConfig[];
}

/**
 * Configuration for each onboarding step
 */
export class OnboardingStepConfig {
  @ApiProperty({ description: 'Step number' })
  step: number;

  @ApiProperty({ description: 'Step name' })
  name: string;

  @ApiProperty({ description: 'Step title' })
  title: string;

  @ApiProperty({ description: 'Step description' })
  description: string;

  @ApiProperty({ description: 'Whether step is required' })
  required: boolean;
}

/**
 * DTO for saving onboarding progress
 */
export class OnboardingProgressDto {
  @ApiProperty({
    description: 'Session ID',
    example: 'session-uuid-12345',
  })
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Current step being completed',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  step: number;

  @ApiProperty({
    description: 'Step data to save',
  })
  @ValidateNested()
  @Type(() => OnboardingStepData)
  data: OnboardingStepData;
}

/**
 * Data collected during each onboarding step
 */
export class OnboardingStepData {
  // Step 1: Name
  @ApiPropertyOptional({
    description: 'User name',
    example: 'Maria Silva',
  })
  @IsString()
  @IsOptional()
  name?: string;

  // Step 2: Gender
  @ApiPropertyOptional({
    description: 'User gender',
    enum: ['male', 'female'],
  })
  @IsEnum(['male', 'female'])
  @IsOptional()
  gender?: 'male' | 'female';

  // Step 3: Birth date
  @ApiPropertyOptional({
    description: 'Birth date in ISO format',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  // Step 4: Birth time
  @ApiPropertyOptional({
    description: 'Birth time in HH:mm format',
    example: '14:30',
  })
  @IsString()
  @IsOptional()
  birthTime?: string;

  // Step 4: Birth place
  @ApiPropertyOptional({
    description: 'Birth place',
    example: 'Sao Paulo, Brazil',
  })
  @IsString()
  @IsOptional()
  birthPlace?: string;

  // Step 5: Interests
  @ApiPropertyOptional({
    description: 'User interests',
    example: ['love', 'career', 'health'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  // Step 5: Quiz answers
  @ApiPropertyOptional({
    description: 'Quiz answers',
    example: { q1: 'a', q2: 'b' },
  })
  @IsOptional()
  quizAnswers?: Record<string, string>;
}

/**
 * DTO for completing onboarding and creating user
 */
export class CompleteOnboardingDto {
  @ApiProperty({
    description: 'Session ID',
    example: 'session-uuid-12345',
  })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Optional email for account creation',
    example: 'user@example.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Optional password for account creation',
    example: 'securePassword123',
  })
  @IsString()
  @IsOptional()
  password?: string;
}

/**
 * Response DTO for completed onboarding
 */
export class OnboardingCompleteResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Created user ID' })
  userId: string;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User sun sign' })
  sunSign: string;

  @ApiProperty({ description: 'User moon sign (if birth time provided)' })
  moonSign?: string;

  @ApiProperty({ description: 'User ascendant (if birth time provided)' })
  ascendant?: string;
}
