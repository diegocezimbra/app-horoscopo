import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodiacSign, ZODIAC_SIGNS } from '../types/zodiac.types';

/**
 * DTO for requesting a horoscope reading
 */
export class ReadingRequestDto {
  @ApiProperty({
    description: 'Zodiac sign for the reading',
    enum: ZODIAC_SIGNS,
    example: 'aries',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Type of reading',
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily',
  })
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  @IsOptional()
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @ApiPropertyOptional({
    description: 'Specific areas of focus',
    example: ['love', 'career', 'health'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  focusAreas?: string[];
}

/**
 * DTO for compatibility request between two signs
 */
export class CompatibilityRequestDto {
  @ApiProperty({
    description: 'First zodiac sign',
    enum: ZODIAC_SIGNS,
    example: 'aries',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign1: ZodiacSign;

  @ApiProperty({
    description: 'Second zodiac sign',
    enum: ZODIAC_SIGNS,
    example: 'leo',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign2: ZodiacSign;
}

/**
 * Response DTO for daily horoscope
 */
export class DailyHoroscopeResponseDto {
  sign: ZodiacSign;
  date: string;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  compatibility: ZodiacSign;
}

/**
 * Response DTO for compatibility reading
 */
export class CompatibilityResponseDto {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  communicationScore: number;
  trustScore: number;
  sharedActivitiesScore: number;
  analysis: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
}
