/**
 * Core Astrology Types
 *
 * This file contains all TypeScript type definitions used throughout
 * the astrology engine for birth charts, horoscopes, and compatibility.
 */

// Import shared types from zodiac.types to avoid duplication
import { CompatibilityResult } from './zodiac.types';

/**
 * All zodiac signs as a union type
 */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/**
 * Four classical elements
 */
export type Element = 'fire' | 'earth' | 'air' | 'water';

/**
 * Three modalities (quadruplicities)
 */
export type Modality = 'cardinal' | 'fixed' | 'mutable';

/**
 * All planets used in astrology
 */
export type Planet =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

/**
 * Astrological aspects between planets
 */
export type Aspect =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition'
  | 'quincunx';

/**
 * House type classification
 */
export type HouseType = 'angular' | 'succedent' | 'cadent';

/**
 * Planetary dignity states
 */
export type Dignity = 'domicile' | 'exaltation' | 'detriment' | 'fall' | null;

/**
 * Position of a planet in the chart
 */
export interface PlanetPosition {
  /** The planet */
  planet: Planet;
  /** Zodiac sign it occupies */
  sign: ZodiacSign;
  /** Degree within the sign (0-29.99) */
  degree: number;
  /** House number (1-12) */
  house: number;
  /** Is the planet retrograde? */
  retrograde: boolean;
  /** Planetary dignity in this sign */
  dignity: Dignity;
}

/**
 * Aspect between two planets
 */
export interface PlanetaryAspect {
  /** First planet */
  planet1: Planet;
  /** Second planet */
  planet2: Planet;
  /** Type of aspect */
  aspect: Aspect;
  /** Exact degree of the aspect */
  exactDegree: number;
  /** Orb (how far from exact) */
  orb: number;
  /** Is this aspect applying (getting closer) or separating? */
  applying: boolean;
  /** Interpretation of this aspect */
  interpretation: string;
}

/**
 * House cusp information
 */
export interface HouseCusp {
  /** House number (1-12) */
  house: number;
  /** Sign on the cusp */
  sign: ZodiacSign;
  /** Degree on the cusp */
  degree: number;
}

/**
 * Complete natal chart
 */
export interface NatalChart {
  /** Unique identifier */
  id: string;
  /** Name of the person */
  name: string;
  /** Birth date */
  birthDate: Date;
  /** Birth time (HH:MM format) */
  birthTime: string | null;
  /** Birth place */
  birthPlace: string | null;
  /** Sun sign */
  sunSign: ZodiacSign;
  /** Moon sign */
  moonSign: ZodiacSign;
  /** Rising sign (Ascendant) */
  risingSign: ZodiacSign;
  /** All planet positions */
  planets: PlanetPosition[];
  /** All house cusps */
  houses: HouseCusp[];
  /** Significant aspects */
  aspects: PlanetaryAspect[];
  /** Dominant element */
  dominantElement: Element;
  /** Dominant modality */
  dominantModality: Modality;
  /** Generated timestamp */
  generatedAt: Date;
}

/**
 * Chart interpretation for a specific area
 */
export interface ChartAreaInterpretation {
  /** Area name (personality, love, career, etc.) */
  area: string;
  /** Title for this interpretation */
  title: string;
  /** Main interpretation text */
  interpretation: string;
  /** Key planetary influences */
  keyInfluences: string[];
  /** Strengths in this area */
  strengths: string[];
  /** Challenges in this area */
  challenges: string[];
  /** Advice based on the chart */
  advice: string;
}

/**
 * Complete chart interpretation
 */
export interface ChartInterpretation {
  /** Overview of the chart */
  overview: string;
  /** Big three summary (Sun, Moon, Rising) */
  bigThree: {
    sun: string;
    moon: string;
    rising: string;
  };
  /** Interpretations by life area */
  areas: ChartAreaInterpretation[];
  /** Key themes in this chart */
  keyThemes: string[];
  /** Life path insights */
  lifePath: string;
  /** Current transits affecting the chart */
  currentTransits?: string;
}

/**
 * Daily horoscope for a sign
 */
export interface DailyHoroscope {
  /** Zodiac sign */
  sign: ZodiacSign;
  /** Date of the horoscope */
  date: Date;
  /** General daily message */
  general: string;
  /** Love and relationships */
  love: string;
  /** Career and work */
  career: string;
  /** Health and wellness */
  health: string;
  /** Lucky elements for the day */
  lucky: {
    number: number;
    color: string;
    time: string;
  };
  /** Overall mood for the day */
  mood: string;
  /** Compatibility with other signs for this day */
  compatibleSigns: ZodiacSign[];
  /** Rating 1-5 for different areas */
  ratings: {
    overall: number;
    love: number;
    career: number;
    health: number;
  };
  /** Mystical advice */
  advice: string;
}

/**
 * Weekly horoscope for a sign
 */
export interface WeeklyHoroscope {
  /** Zodiac sign */
  sign: ZodiacSign;
  /** Start date of the week */
  weekStart: Date;
  /** End date of the week */
  weekEnd: Date;
  /** Overall weekly theme */
  theme: string;
  /** General overview */
  overview: string;
  /** Love and relationships for the week */
  love: string;
  /** Career and finances for the week */
  career: string;
  /** Health focus for the week */
  health: string;
  /** Day-by-day brief forecasts */
  dailyHighlights: {
    day: string;
    highlight: string;
  }[];
  /** Best days of the week */
  bestDays: string[];
  /** Challenging days of the week */
  challengingDays: string[];
  /** Weekly affirmation */
  affirmation: string;
}

/**
 * Monthly horoscope for a sign
 */
export interface MonthlyHoroscope {
  /** Zodiac sign */
  sign: ZodiacSign;
  /** Month (1-12) */
  month: number;
  /** Year */
  year: number;
  /** Monthly theme */
  theme: string;
  /** Comprehensive overview */
  overview: string;
  /** Love and relationships */
  love: string;
  /** Career and finances */
  career: string;
  /** Health and wellness */
  health: string;
  /** Personal growth focus */
  growth: string;
  /** Key dates to watch */
  keyDates: {
    date: string;
    significance: string;
  }[];
  /** Planetary influences this month */
  planetaryInfluences: string;
  /** Monthly mantra */
  mantra: string;
  /** Focus areas for each week */
  weeklyFocus: string[];
}

/**
 * Detailed compatibility using full charts
 * Extends the base CompatibilityResult with additional synastry analysis
 */
export interface DetailedCompatibility extends CompatibilityResult {
  /** Synastry aspects between the charts */
  synastryAspects: {
    aspect: string;
    planets: string;
    interpretation: string;
    isHarmonious: boolean;
  }[];
  /** Venus-Mars dynamics */
  venusMarsDynamics: string;
  /** Moon compatibility */
  moonCompatibility: string;
  /** Communication style comparison */
  communicationStyles: string;
  /** Long-term potential */
  longTermPotential: string;
  /** Areas of growth together */
  growthAreas: string[];
}

/**
 * Celebrity match based on natal chart
 */
export interface CelebrityMatch {
  /** Celebrity name */
  name: string;
  /** Their sun sign */
  sunSign: ZodiacSign;
  /** Match percentage */
  matchPercentage: number;
  /** What you have in common */
  commonalities: string[];
  /** Fun fact about the match */
  funFact: string;
}

/**
 * Birth data input for chart calculation
 */
export interface BirthData {
  /** Person's name */
  name: string;
  /** Birth date */
  birthDate: Date;
  /** Birth time (HH:MM format, optional) */
  birthTime?: string;
  /** Birth city/location (optional) */
  birthPlace?: string;
  /** Birth coordinates if known */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Transit information
 */
export interface Transit {
  /** Transiting planet */
  planet: Planet;
  /** Sign it's currently in */
  currentSign: ZodiacSign;
  /** Current degree */
  currentDegree: number;
  /** Is it retrograde? */
  retrograde: boolean;
  /** When did it enter this sign? */
  enteredSign: Date;
  /** When will it leave this sign? */
  leavesSign: Date;
  /** General meaning of this transit */
  meaning: string;
}

/**
 * Personal transit - transit relative to a natal chart
 */
export interface PersonalTransit {
  /** The transit */
  transit: Transit;
  /** Which natal planet/point it aspects */
  natalPoint: string;
  /** What aspect it forms */
  aspect: Aspect;
  /** When is this transit exact? */
  exactDate: Date;
  /** How long does it last? */
  duration: string;
  /** Personal interpretation */
  interpretation: string;
  /** Intensity (1-10) */
  intensity: number;
}

/**
 * Horoscope period type
 */
export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Horoscope category/area
 */
export type HoroscopeCategory = 'general' | 'love' | 'career' | 'health' | 'finance' | 'spiritual';

/**
 * Element balance in a chart
 */
export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominant: Element;
  lacking: Element | null;
  interpretation: string;
}

/**
 * Modality balance in a chart
 */
export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
  dominant: Modality;
  lacking: Modality | null;
  interpretation: string;
}

/**
 * Chart pattern (Grand Trine, T-Square, etc.)
 */
export interface ChartPattern {
  name: string;
  planets: Planet[];
  signs: ZodiacSign[];
  description: string;
  gifts: string[];
  challenges: string[];
}
