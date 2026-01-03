/**
 * Astrology Types Index
 * Re-exports all type definitions for the astrology module
 * Note: zodiac.types.ts is the source of truth for base types
 * astrology.types.ts extends with additional types
 */

// Base zodiac types (source of truth)
export * from './zodiac.types';

// Extended astrology types (only export non-duplicates)
export type {
  HouseType,
  Dignity,
  PlanetaryAspect,
  HouseCusp,
  ChartAreaInterpretation,
  ChartInterpretation,
  WeeklyHoroscope,
  MonthlyHoroscope,
  DetailedCompatibility,
  BirthData,
  Transit,
  PersonalTransit,
  HoroscopePeriod,
  HoroscopeCategory,
  ElementBalance,
  ModalityBalance,
  ChartPattern,
} from './astrology.types';
