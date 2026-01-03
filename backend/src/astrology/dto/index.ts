/**
 * Astrology DTOs Index
 * Re-exports all DTOs for the astrology module
 */

export * from './birth-data.dto';
export * from './horoscope.dto';
export * from './compatibility.dto';
export * from './natal-chart.dto';

// Only export unique items from reading-request.dto (avoid duplicates)
export { ReadingRequestDto } from './reading-request.dto';
