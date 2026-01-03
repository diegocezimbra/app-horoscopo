import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating user profile
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User display name',
    example: 'Maria Silva',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'User gender',
    enum: ['male', 'female'],
    example: 'female',
  })
  @IsEnum(['male', 'female'])
  @IsOptional()
  gender?: 'male' | 'female';

  @ApiPropertyOptional({
    description: 'User birth date in ISO format',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'User birth time in HH:mm format',
    example: '14:30',
  })
  @IsString()
  @IsOptional()
  birthTime?: string;

  @ApiPropertyOptional({
    description: 'User birth place (city, country)',
    example: 'Sao Paulo, Brazil',
  })
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiPropertyOptional({
    description: 'User interests for personalized content',
    example: ['love', 'career', 'health'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({
    description: 'Quiz answers for personalization',
    example: { q1: 'a', q2: 'c' },
  })
  @IsOptional()
  quizAnswers?: Record<string, string>;
}

/**
 * DTO for user profile response
 */
export class UserProfileDto {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: string | null;
  birthPlace: string | null;
  interests: string[];
  sunSign: string;
  moonSign: string | null;
  ascendant: string | null;
  subscriptionTier: 'free' | 'premium' | 'ultimate';
  createdAt: Date;
}
