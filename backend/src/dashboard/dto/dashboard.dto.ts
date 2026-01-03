import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type MoonPhase =
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export type ZodiacSignId =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export class MoonInfoDto {
  @ApiProperty()
  phase: MoonPhase;

  @ApiProperty()
  sign: ZodiacSignId;

  @ApiProperty()
  signName: string;

  @ApiProperty()
  description: string;
}

export class DailyHoroscopeDto {
  @ApiProperty()
  sign: ZodiacSignId;

  @ApiProperty()
  signName: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  fullText: string;

  @ApiProperty()
  date: string;

  @ApiPropertyOptional()
  energyRating?: number;
}

export class EnergyRatingDto {
  @ApiProperty()
  category: 'love' | 'work' | 'health' | 'money';

  @ApiProperty()
  label: string;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  icon: string;
}

export class DailyEnergyDto {
  @ApiProperty()
  overall: number;

  @ApiProperty()
  sentiment: 'positive' | 'neutral' | 'negative';

  @ApiProperty({ type: [EnergyRatingDto] })
  ratings: EnergyRatingDto[];
}

export class StreakInfoDto {
  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;

  @ApiProperty()
  lastVisit: string;

  @ApiProperty()
  isMilestone: boolean;

  @ApiPropertyOptional()
  milestoneMessage?: string;
}

export class LuckyNumbersDto {
  @ApiProperty({ type: [Number] })
  numbers: number[];

  @ApiProperty()
  generatedAt: string;
}

export class CosmicEventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  daysUntil: number;

  @ApiProperty()
  type: 'retrograde' | 'eclipse' | 'new-moon' | 'full-moon' | 'conjunction' | 'other';

  @ApiProperty()
  icon: string;
}

export class UserProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: 'male' | 'female';

  @ApiProperty()
  birthDate: string;

  @ApiProperty()
  sunSign: ZodiacSignId;

  @ApiPropertyOptional()
  moonSign?: ZodiacSignId;

  @ApiPropertyOptional()
  risingSign?: ZodiacSignId;

  @ApiPropertyOptional()
  avatarUrl?: string;
}

export class GreetingDto {
  @ApiProperty()
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

  @ApiProperty()
  message: string;
}

export class DashboardDataDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;

  @ApiProperty({ type: MoonInfoDto })
  moon: MoonInfoDto;

  @ApiProperty({ type: DailyHoroscopeDto })
  horoscope: DailyHoroscopeDto;

  @ApiProperty({ type: DailyEnergyDto })
  energy: DailyEnergyDto;

  @ApiProperty({ type: StreakInfoDto })
  streak: StreakInfoDto;

  @ApiProperty({ type: LuckyNumbersDto })
  luckyNumbers: LuckyNumbersDto;

  @ApiProperty({ type: [CosmicEventDto] })
  cosmicEvents: CosmicEventDto[];

  @ApiProperty({ type: GreetingDto })
  greeting: GreetingDto;
}
