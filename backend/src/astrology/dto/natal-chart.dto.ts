import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZODIAC_SIGNS, ZodiacSign, Planet, Aspect } from '../types/zodiac.types';

/**
 * Planet position in the natal chart
 */
export class PlanetPositionDto {
  @ApiProperty({ description: 'Planet name' })
  planet: Planet;

  @ApiProperty({ description: 'Zodiac sign', enum: ZODIAC_SIGNS })
  sign: ZodiacSign;

  @ApiProperty({ description: 'Degree within the sign (0-29)', example: 15.5 })
  degree: number;

  @ApiProperty({ description: 'House number (1-12)', example: 7 })
  house: number;

  @ApiProperty({ description: 'Is the planet retrograde?' })
  retrograde: boolean;

  @ApiPropertyOptional({ description: 'Planetary dignity state' })
  dignity?: 'domicile' | 'exaltation' | 'detriment' | 'fall' | null;
}

/**
 * Aspect between two planets
 */
export class PlanetaryAspectDto {
  @ApiProperty({ description: 'First planet' })
  planet1: Planet;

  @ApiProperty({ description: 'Second planet' })
  planet2: Planet;

  @ApiProperty({ description: 'Aspect type' })
  aspect: Aspect;

  @ApiProperty({ description: 'Orb (deviation from exact)', example: 2.5 })
  orb: number;

  @ApiProperty({ description: 'Is aspect applying or separating' })
  applying: boolean;

  @ApiProperty({ description: 'Interpretation of this aspect' })
  interpretation: string;
}

/**
 * House cusp information
 */
export class HouseCuspDto {
  @ApiProperty({ description: 'House number (1-12)', example: 1 })
  house: number;

  @ApiProperty({ description: 'Sign on the cusp', enum: ZODIAC_SIGNS })
  sign: ZodiacSign;

  @ApiProperty({ description: 'Degree on the cusp', example: 5.25 })
  degree: number;
}

/**
 * Element balance in the chart
 */
export class ElementBalanceDto {
  @ApiProperty({ description: 'Fire element count', example: 3 })
  fire: number;

  @ApiProperty({ description: 'Earth element count', example: 2 })
  earth: number;

  @ApiProperty({ description: 'Air element count', example: 4 })
  air: number;

  @ApiProperty({ description: 'Water element count', example: 1 })
  water: number;

  @ApiProperty({ description: 'Dominant element' })
  dominant: 'fire' | 'earth' | 'air' | 'water';

  @ApiPropertyOptional({ description: 'Lacking element (if any)' })
  lacking?: 'fire' | 'earth' | 'air' | 'water' | null;

  @ApiProperty({ description: 'Interpretation of element balance' })
  interpretation: string;
}

/**
 * Modality balance in the chart
 */
export class ModalityBalanceDto {
  @ApiProperty({ description: 'Cardinal modality count', example: 4 })
  cardinal: number;

  @ApiProperty({ description: 'Fixed modality count', example: 3 })
  fixed: number;

  @ApiProperty({ description: 'Mutable modality count', example: 3 })
  mutable: number;

  @ApiProperty({ description: 'Dominant modality' })
  dominant: 'cardinal' | 'fixed' | 'mutable';

  @ApiPropertyOptional({ description: 'Lacking modality (if any)' })
  lacking?: 'cardinal' | 'fixed' | 'mutable' | null;

  @ApiProperty({ description: 'Interpretation of modality balance' })
  interpretation: string;
}

/**
 * Big Three summary (Sun, Moon, Rising)
 */
export class BigThreeDto {
  @ApiProperty({ description: 'Sun sign interpretation' })
  sun: string;

  @ApiProperty({ description: 'Moon sign interpretation' })
  moon: string;

  @ApiProperty({ description: 'Rising sign interpretation' })
  rising: string;
}

/**
 * Chart area interpretation
 */
export class ChartAreaInterpretationDto {
  @ApiProperty({ description: 'Area name (personality, love, career, etc.)' })
  area: string;

  @ApiProperty({ description: 'Title for this interpretation' })
  title: string;

  @ApiProperty({ description: 'Main interpretation text' })
  interpretation: string;

  @ApiProperty({ description: 'Key planetary influences', type: [String] })
  keyInfluences: string[];

  @ApiProperty({ description: 'Strengths in this area', type: [String] })
  strengths: string[];

  @ApiProperty({ description: 'Challenges in this area', type: [String] })
  challenges: string[];

  @ApiProperty({ description: 'Advice for this area' })
  advice: string;
}

/**
 * Complete natal chart response
 */
export class NatalChartResponseDto {
  @ApiProperty({ description: 'Chart ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Name of the person' })
  name?: string;

  @ApiProperty({ description: 'Birth date' })
  birthDate: string;

  @ApiPropertyOptional({ description: 'Birth time' })
  birthTime?: string;

  @ApiPropertyOptional({ description: 'Birth place' })
  birthPlace?: string;

  @ApiProperty({ description: 'Sun sign', enum: ZODIAC_SIGNS })
  sunSign: ZodiacSign;

  @ApiProperty({ description: 'Moon sign', enum: ZODIAC_SIGNS })
  moonSign: ZodiacSign;

  @ApiProperty({ description: 'Rising sign (Ascendant)', enum: ZODIAC_SIGNS })
  risingSign: ZodiacSign;

  @ApiProperty({ description: 'All planet positions', type: [PlanetPositionDto] })
  planets: PlanetPositionDto[];

  @ApiProperty({ description: 'House cusps', type: [HouseCuspDto] })
  houses: HouseCuspDto[];

  @ApiProperty({ description: 'Significant aspects', type: [PlanetaryAspectDto] })
  aspects: PlanetaryAspectDto[];

  @ApiProperty({ description: 'Element balance', type: ElementBalanceDto })
  elementBalance: ElementBalanceDto;

  @ApiProperty({ description: 'Modality balance', type: ModalityBalanceDto })
  modalityBalance: ModalityBalanceDto;

  @ApiProperty({ description: 'When the chart was generated' })
  generatedAt: string;
}

/**
 * Chart interpretation response
 */
export class ChartInterpretationResponseDto {
  @ApiProperty({ description: 'Overview of the chart' })
  overview: string;

  @ApiProperty({ description: 'Big Three summary', type: BigThreeDto })
  bigThree: BigThreeDto;

  @ApiProperty({ description: 'Interpretations by life area', type: [ChartAreaInterpretationDto] })
  areas: ChartAreaInterpretationDto[];

  @ApiProperty({ description: 'Key themes in this chart', type: [String] })
  keyThemes: string[];

  @ApiProperty({ description: 'Life path insights' })
  lifePath: string;

  @ApiPropertyOptional({ description: 'Current transits affecting the chart' })
  currentTransits?: string;
}

/**
 * Complete natal chart with interpretation
 */
export class FullNatalChartResponseDto {
  @ApiProperty({ description: 'The natal chart', type: NatalChartResponseDto })
  chart: NatalChartResponseDto;

  @ApiProperty({ description: 'Chart interpretation', type: ChartInterpretationResponseDto })
  interpretation: ChartInterpretationResponseDto;
}
