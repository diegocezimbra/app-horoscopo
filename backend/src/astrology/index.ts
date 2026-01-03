/**
 * Astrology Module Index
 *
 * Main export file for the astrology engine.
 * Re-exports all public APIs from the module.
 */

// Module
export * from './astrology.module';

// Main service (facade)
export * from './astrology.service';

// Specialized services
export * from './services';

// Data (static data files)
export {
  // zodiac.data.ts
  ZODIAC_SIGNS as ZODIAC_SIGN_DATA,
  ELEMENT_COMPATIBILITY,
  MODALITY_COMPATIBILITY,
  ZODIAC_SIGN_ORDER,
  getZodiacSignFromDate,
  type DateRange,
  type ZodiacSignData,
} from './data/zodiac.data';

export {
  // planets.data.ts
  PLANETS as PLANET_DATA,
  LUNAR_NODES,
  CHIRON,
  PLANETARY_ASPECTS,
  PLANETARY_DIGNITIES,
  PERSONAL_PLANETS,
  SOCIAL_PLANETS,
  OUTER_PLANETS,
  type PlanetData,
  type LunarNode,
  type AspectData,
} from './data/planets.data';

export {
  // houses.data.ts
  HOUSES as HOUSE_DATA,
  ANGULAR_HOUSES,
  QUADRANTS,
  HEMISPHERES,
  HOUSE_TYPES,
  DERIVATIVE_HOUSES,
  type HouseData,
} from './data/houses.data';

// Types (type definitions)
export * from './types';

// DTOs
export * from './dto';
