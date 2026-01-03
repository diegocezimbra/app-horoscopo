import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ZODIAC_SIGNS, ZodiacSign } from '../types/zodiac.types';
import { BirthDataDto } from './birth-data.dto';

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
 * DTO for detailed compatibility using full birth charts
 */
export class DetailedCompatibilityRequestDto {
  @ApiProperty({
    description: 'First person birth data',
    type: BirthDataDto,
  })
  @ValidateNested()
  @Type(() => BirthDataDto)
  person1: BirthDataDto;

  @ApiProperty({
    description: 'Second person birth data',
    type: BirthDataDto,
  })
  @ValidateNested()
  @Type(() => BirthDataDto)
  person2: BirthDataDto;
}

/**
 * Compatibility analysis details
 */
export class CompatibilityAnalysisDto {
  @ApiProperty({ description: 'Strengths of this pairing', type: [String] })
  strengths: string[];

  @ApiProperty({ description: 'Challenges to work on', type: [String] })
  challenges: string[];

  @ApiProperty({ description: 'Advice for the relationship' })
  advice: string;
}

/**
 * Response DTO for basic compatibility
 */
export class CompatibilityResponseDto {
  @ApiProperty({ description: 'First sign', enum: ZODIAC_SIGNS })
  sign1: ZodiacSign;

  @ApiProperty({ description: 'Second sign', enum: ZODIAC_SIGNS })
  sign2: ZodiacSign;

  @ApiProperty({ description: 'Overall compatibility score (0-100)', example: 85 })
  overallScore: number;

  @ApiProperty({ description: 'Emotional compatibility score (0-100)', example: 80 })
  emotionalScore: number;

  @ApiProperty({ description: 'Communication compatibility score (0-100)', example: 75 })
  communicationScore: number;

  @ApiProperty({ description: 'Passion/physical compatibility score (0-100)', example: 90 })
  passionScore: number;

  @ApiProperty({ description: 'Values compatibility score (0-100)', example: 70 })
  valuesScore: number;

  @ApiProperty({ description: 'Compatibility summary' })
  summary: string;

  @ApiProperty({ description: 'Detailed analysis', type: CompatibilityAnalysisDto })
  analysis: CompatibilityAnalysisDto;

  @ApiPropertyOptional({ description: 'Famous couples with this combination', type: [String] })
  famousCouples?: string[];
}

/**
 * Synastry aspect between two charts
 */
export class SynastryAspectDto {
  @ApiProperty({ description: 'Aspect type', example: 'Venus conjunct Mars' })
  aspect: string;

  @ApiProperty({ description: 'Planets involved', example: 'Venus de Pessoa 1 conjunta Marte de Pessoa 2' })
  planets: string;

  @ApiProperty({ description: 'Interpretation of this aspect' })
  interpretation: string;

  @ApiProperty({ description: 'Whether this is a harmonious aspect' })
  isHarmonious: boolean;
}

/**
 * Response DTO for detailed compatibility (chart-based)
 */
export class DetailedCompatibilityResponseDto extends CompatibilityResponseDto {
  @ApiProperty({ description: 'Synastry aspects between charts', type: [SynastryAspectDto] })
  synastryAspects: SynastryAspectDto[];

  @ApiProperty({ description: 'Venus-Mars dynamics analysis' })
  venusMarsDynamics: string;

  @ApiProperty({ description: 'Moon compatibility analysis' })
  moonCompatibility: string;

  @ApiProperty({ description: 'Communication style comparison' })
  communicationStyles: string;

  @ApiProperty({ description: 'Long-term potential analysis' })
  longTermPotential: string;

  @ApiProperty({ description: 'Areas of growth together', type: [String] })
  growthAreas: string[];
}

/**
 * Celebrity match response
 */
export class CelebrityMatchDto {
  @ApiProperty({ description: 'Celebrity name', example: 'Brad Pitt' })
  name: string;

  @ApiProperty({ description: 'Celebrity sun sign', enum: ZODIAC_SIGNS })
  sunSign: ZodiacSign;

  @ApiProperty({ description: 'Match percentage (0-100)', example: 87 })
  matchPercentage: number;

  @ApiProperty({ description: 'What you have in common', type: [String] })
  commonalities: string[];

  @ApiProperty({ description: 'Fun fact about this match' })
  funFact: string;
}

/**
 * Response DTO for celebrity matches
 */
export class CelebrityMatchesResponseDto {
  @ApiProperty({ description: 'User sign for reference', enum: ZODIAC_SIGNS })
  userSign: ZodiacSign;

  @ApiProperty({ description: 'List of celebrity matches', type: [CelebrityMatchDto] })
  matches: CelebrityMatchDto[];
}
