import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ZODIAC_SIGNS, ZodiacSign } from '../types/zodiac.types';

/**
 * DTO for requesting a daily horoscope
 */
export class DailyHoroscopeRequestDto {
  @ApiProperty({
    description: 'Zodiac sign for the horoscope',
    enum: ZODIAC_SIGNS,
    example: 'aries',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Date for the horoscope (defaults to today)',
    example: '2024-03-15',
  })
  @IsString()
  @IsOptional()
  date?: string;
}

/**
 * DTO for requesting a weekly horoscope
 */
export class WeeklyHoroscopeRequestDto {
  @ApiProperty({
    description: 'Zodiac sign for the horoscope',
    enum: ZODIAC_SIGNS,
    example: 'leo',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Start date of the week (defaults to current week)',
    example: '2024-03-11',
  })
  @IsString()
  @IsOptional()
  weekStart?: string;
}

/**
 * DTO for requesting a monthly horoscope
 */
export class MonthlyHoroscopeRequestDto {
  @ApiProperty({
    description: 'Zodiac sign for the horoscope',
    enum: ZODIAC_SIGNS,
    example: 'virgo',
  })
  @IsEnum(ZODIAC_SIGNS)
  sign: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Month (1-12)',
    example: 3,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @ApiPropertyOptional({
    description: 'Year',
    example: 2024,
  })
  @IsNumber()
  @IsOptional()
  year?: number;
}

/**
 * Response DTO for lucky elements
 */
export class LuckyElementsDto {
  @ApiProperty({ description: 'Lucky number for the period', example: 7 })
  number: number;

  @ApiProperty({ description: 'Lucky color', example: 'azul celeste' })
  color: string;

  @ApiProperty({ description: 'Lucky time of day', example: '14:00' })
  time: string;
}

/**
 * Response DTO for horoscope ratings
 */
export class HoroscopeRatingsDto {
  @ApiProperty({ description: 'Overall rating 1-5', example: 4 })
  overall: number;

  @ApiProperty({ description: 'Love rating 1-5', example: 5 })
  love: number;

  @ApiProperty({ description: 'Career rating 1-5', example: 3 })
  career: number;

  @ApiProperty({ description: 'Health rating 1-5', example: 4 })
  health: number;
}

/**
 * Response DTO for daily horoscope
 */
export class DailyHoroscopeResponseDto {
  @ApiProperty({ description: 'Zodiac sign', enum: ZODIAC_SIGNS })
  sign: ZodiacSign;

  @ApiProperty({ description: 'Date of the horoscope' })
  date: string;

  @ApiProperty({ description: 'General daily message' })
  general: string;

  @ApiProperty({ description: 'Love and relationships forecast' })
  love: string;

  @ApiProperty({ description: 'Career and work forecast' })
  career: string;

  @ApiProperty({ description: 'Health and wellness forecast' })
  health: string;

  @ApiProperty({ description: 'Lucky elements for the day', type: LuckyElementsDto })
  lucky: LuckyElementsDto;

  @ApiProperty({ description: 'Overall mood for the day' })
  mood: string;

  @ApiProperty({ description: 'Most compatible signs today', type: [String] })
  compatibleSigns: ZodiacSign[];

  @ApiProperty({ description: 'Ratings for different life areas', type: HoroscopeRatingsDto })
  ratings: HoroscopeRatingsDto;

  @ApiProperty({ description: 'Mystical advice for the day' })
  advice: string;
}

/**
 * Daily highlight for weekly horoscope
 */
export class DailyHighlightDto {
  @ApiProperty({ description: 'Day of the week', example: 'Segunda-feira' })
  day: string;

  @ApiProperty({ description: 'Highlight for this day' })
  highlight: string;
}

/**
 * Response DTO for weekly horoscope
 */
export class WeeklyHoroscopeResponseDto {
  @ApiProperty({ description: 'Zodiac sign', enum: ZODIAC_SIGNS })
  sign: ZodiacSign;

  @ApiProperty({ description: 'Start date of the week' })
  weekStart: string;

  @ApiProperty({ description: 'End date of the week' })
  weekEnd: string;

  @ApiProperty({ description: 'Overall weekly theme' })
  theme: string;

  @ApiProperty({ description: 'General overview for the week' })
  overview: string;

  @ApiProperty({ description: 'Love forecast for the week' })
  love: string;

  @ApiProperty({ description: 'Career forecast for the week' })
  career: string;

  @ApiProperty({ description: 'Health focus for the week' })
  health: string;

  @ApiProperty({ description: 'Day-by-day highlights', type: [DailyHighlightDto] })
  dailyHighlights: DailyHighlightDto[];

  @ApiProperty({ description: 'Best days of the week', type: [String] })
  bestDays: string[];

  @ApiProperty({ description: 'Challenging days to watch', type: [String] })
  challengingDays: string[];

  @ApiProperty({ description: 'Weekly affirmation' })
  affirmation: string;
}

/**
 * Key date for monthly horoscope
 */
export class KeyDateDto {
  @ApiProperty({ description: 'Date', example: '15' })
  date: string;

  @ApiProperty({ description: 'Significance of this date' })
  significance: string;
}

/**
 * Response DTO for monthly horoscope
 */
export class MonthlyHoroscopeResponseDto {
  @ApiProperty({ description: 'Zodiac sign', enum: ZODIAC_SIGNS })
  sign: ZodiacSign;

  @ApiProperty({ description: 'Month (1-12)' })
  month: number;

  @ApiProperty({ description: 'Year' })
  year: number;

  @ApiProperty({ description: 'Monthly theme' })
  theme: string;

  @ApiProperty({ description: 'Comprehensive overview' })
  overview: string;

  @ApiProperty({ description: 'Love and relationships' })
  love: string;

  @ApiProperty({ description: 'Career and finances' })
  career: string;

  @ApiProperty({ description: 'Health and wellness' })
  health: string;

  @ApiProperty({ description: 'Personal growth focus' })
  growth: string;

  @ApiProperty({ description: 'Key dates to watch', type: [KeyDateDto] })
  keyDates: KeyDateDto[];

  @ApiProperty({ description: 'Planetary influences this month' })
  planetaryInfluences: string;

  @ApiProperty({ description: 'Monthly mantra' })
  mantra: string;

  @ApiProperty({ description: 'Focus for each week', type: [String] })
  weeklyFocus: string[];
}
