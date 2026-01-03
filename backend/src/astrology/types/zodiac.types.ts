/**
 * Zodiac Types and Astrological Constants
 * Comprehensive type definitions for the horoscope application
 */

// ============== ZODIAC SIGNS ==============

/**
 * The 12 zodiac signs in order
 */
export const ZODIAC_SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

/**
 * Zodiac sign information with metadata
 */
export interface ZodiacSignInfo {
  name: ZodiacSign;
  symbol: string;
  element: Element;
  modality: Modality;
  rulingPlanet: Planet;
  dateRange: {
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
  };
  traits: string[];
  compatibility: ZodiacSign[];
}

// ============== ELEMENTS ==============

/**
 * The four classical elements
 */
export const ELEMENTS = ['fire', 'earth', 'air', 'water'] as const;

export type Element = (typeof ELEMENTS)[number];

export const ELEMENT_SIGNS: Record<Element, ZodiacSign[]> = {
  fire: ['aries', 'leo', 'sagittarius'],
  earth: ['taurus', 'virgo', 'capricorn'],
  air: ['gemini', 'libra', 'aquarius'],
  water: ['cancer', 'scorpio', 'pisces'],
};

// ============== MODALITIES ==============

/**
 * The three modalities (quadruplicities)
 */
export const MODALITIES = ['cardinal', 'fixed', 'mutable'] as const;

export type Modality = (typeof MODALITIES)[number];

export const MODALITY_SIGNS: Record<Modality, ZodiacSign[]> = {
  cardinal: ['aries', 'cancer', 'libra', 'capricorn'],
  fixed: ['taurus', 'leo', 'scorpio', 'aquarius'],
  mutable: ['gemini', 'virgo', 'sagittarius', 'pisces'],
};

// ============== PLANETS ==============

/**
 * Astrological planets (including luminaries and modern planets)
 */
export const PLANETS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const;

export type Planet = (typeof PLANETS)[number];

/**
 * Personal planets (fast-moving)
 */
export const PERSONAL_PLANETS: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars'];

/**
 * Social planets
 */
export const SOCIAL_PLANETS: Planet[] = ['jupiter', 'saturn'];

/**
 * Generational planets (slow-moving)
 */
export const GENERATIONAL_PLANETS: Planet[] = ['uranus', 'neptune', 'pluto'];

/**
 * Planet information with metadata
 */
export interface PlanetInfo {
  name: Planet;
  symbol: string;
  rulership: ZodiacSign[];
  exaltation: ZodiacSign | null;
  detriment: ZodiacSign[];
  fall: ZodiacSign | null;
  keywords: string[];
}

// ============== HOUSES ==============

/**
 * The 12 astrological houses
 */
export const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type House = (typeof HOUSES)[number];

/**
 * House information with meanings
 */
export interface HouseInfo {
  number: House;
  name: string;
  naturalSign: ZodiacSign;
  naturalRuler: Planet;
  keywords: string[];
  lifeArea: string;
}

export const HOUSE_MEANINGS: Record<House, HouseInfo> = {
  1: {
    number: 1,
    name: 'First House',
    naturalSign: 'aries',
    naturalRuler: 'mars',
    keywords: ['self', 'identity', 'appearance', 'beginnings'],
    lifeArea: 'Self and Identity',
  },
  2: {
    number: 2,
    name: 'Second House',
    naturalSign: 'taurus',
    naturalRuler: 'venus',
    keywords: ['money', 'possessions', 'values', 'self-worth'],
    lifeArea: 'Finances and Values',
  },
  3: {
    number: 3,
    name: 'Third House',
    naturalSign: 'gemini',
    naturalRuler: 'mercury',
    keywords: ['communication', 'siblings', 'short trips', 'learning'],
    lifeArea: 'Communication and Siblings',
  },
  4: {
    number: 4,
    name: 'Fourth House',
    naturalSign: 'cancer',
    naturalRuler: 'moon',
    keywords: ['home', 'family', 'roots', 'foundation'],
    lifeArea: 'Home and Family',
  },
  5: {
    number: 5,
    name: 'Fifth House',
    naturalSign: 'leo',
    naturalRuler: 'sun',
    keywords: ['creativity', 'romance', 'children', 'pleasure'],
    lifeArea: 'Creativity and Romance',
  },
  6: {
    number: 6,
    name: 'Sixth House',
    naturalSign: 'virgo',
    naturalRuler: 'mercury',
    keywords: ['health', 'work', 'service', 'routines'],
    lifeArea: 'Health and Daily Work',
  },
  7: {
    number: 7,
    name: 'Seventh House',
    naturalSign: 'libra',
    naturalRuler: 'venus',
    keywords: ['partnerships', 'marriage', 'contracts', 'others'],
    lifeArea: 'Partnerships and Marriage',
  },
  8: {
    number: 8,
    name: 'Eighth House',
    naturalSign: 'scorpio',
    naturalRuler: 'pluto',
    keywords: ['transformation', 'shared resources', 'death', 'rebirth'],
    lifeArea: 'Transformation and Shared Resources',
  },
  9: {
    number: 9,
    name: 'Ninth House',
    naturalSign: 'sagittarius',
    naturalRuler: 'jupiter',
    keywords: ['philosophy', 'travel', 'higher education', 'beliefs'],
    lifeArea: 'Philosophy and Long-Distance Travel',
  },
  10: {
    number: 10,
    name: 'Tenth House',
    naturalSign: 'capricorn',
    naturalRuler: 'saturn',
    keywords: ['career', 'reputation', 'authority', 'public image'],
    lifeArea: 'Career and Public Image',
  },
  11: {
    number: 11,
    name: 'Eleventh House',
    naturalSign: 'aquarius',
    naturalRuler: 'uranus',
    keywords: ['friends', 'groups', 'hopes', 'wishes'],
    lifeArea: 'Friends and Social Groups',
  },
  12: {
    number: 12,
    name: 'Twelfth House',
    naturalSign: 'pisces',
    naturalRuler: 'neptune',
    keywords: ['unconscious', 'secrets', 'isolation', 'spirituality'],
    lifeArea: 'Spirituality and the Unconscious',
  },
};

// ============== ASPECTS ==============

/**
 * Major astrological aspects
 */
export const ASPECTS = [
  'conjunction',
  'sextile',
  'square',
  'trine',
  'opposition',
] as const;

export type Aspect = (typeof ASPECTS)[number];

/**
 * Minor aspects
 */
export const MINOR_ASPECTS = [
  'semi-sextile',
  'semi-square',
  'sesquiquadrate',
  'quincunx',
  'quintile',
  'bi-quintile',
] as const;

export type MinorAspect = (typeof MINOR_ASPECTS)[number];

/**
 * Aspect information with orbs and meanings
 */
export interface AspectInfo {
  name: Aspect | MinorAspect;
  degrees: number;
  symbol: string;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  keywords: string[];
}

export const ASPECT_INFO: Record<Aspect, AspectInfo> = {
  conjunction: {
    name: 'conjunction',
    degrees: 0,
    symbol: '0',
    orb: 8,
    nature: 'neutral',
    keywords: ['fusion', 'unity', 'intensity', 'beginning'],
  },
  sextile: {
    name: 'sextile',
    degrees: 60,
    symbol: '*',
    orb: 6,
    nature: 'harmonious',
    keywords: ['opportunity', 'talent', 'ease', 'cooperation'],
  },
  square: {
    name: 'square',
    degrees: 90,
    symbol: '[]',
    orb: 8,
    nature: 'challenging',
    keywords: ['tension', 'challenge', 'action', 'friction'],
  },
  trine: {
    name: 'trine',
    degrees: 120,
    symbol: '/\\',
    orb: 8,
    nature: 'harmonious',
    keywords: ['flow', 'harmony', 'talent', 'ease'],
  },
  opposition: {
    name: 'opposition',
    degrees: 180,
    symbol: 'O-O',
    orb: 8,
    nature: 'challenging',
    keywords: ['polarity', 'awareness', 'balance', 'projection'],
  },
};

// ============== NATAL CHART ==============

/**
 * Planet position in the natal chart
 */
export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  house: House;
  retrograde: boolean;
}

/**
 * Aspect between two planets
 */
export interface ChartAspect {
  planet1: Planet;
  planet2: Planet;
  aspect: Aspect | MinorAspect;
  orb: number;
  applying: boolean;
}

/**
 * Complete natal chart structure
 */
export interface NatalChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
  planets: PlanetPosition[];
  houses: {
    house: House;
    sign: ZodiacSign;
    degree: number;
  }[];
  aspects: ChartAspect[];
  calculatedAt: Date;
}

// ============== HOROSCOPE ==============

/**
 * Daily horoscope structure
 */
export interface DailyHoroscope {
  sign: ZodiacSign;
  date: Date;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  compatibility: ZodiacSign;
}

// ============== COMPATIBILITY ==============

/**
 * Compatibility result between two signs
 */
export interface CompatibilityResult {
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

// ============== CELEBRITY MATCH ==============

/**
 * Celebrity match structure
 */
export interface CelebrityMatch {
  name: string;
  birthDate: Date;
  sunSign: ZodiacSign;
  moonSign?: ZodiacSign;
  ascendant?: ZodiacSign;
  matchScore: number;
  sharedPlacements: string[];
  category: 'entertainment' | 'sports' | 'politics' | 'science' | 'arts' | 'business';
}

// ============== ZODIAC SIGN DATA ==============

/**
 * Complete zodiac sign data
 */
export const ZODIAC_SIGN_DATA: Record<ZodiacSign, ZodiacSignInfo> = {
  aries: {
    name: 'aries',
    symbol: 'Ram',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'mars',
    dateRange: { startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    traits: ['courageous', 'determined', 'confident', 'enthusiastic', 'optimistic'],
    compatibility: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  },
  taurus: {
    name: 'taurus',
    symbol: 'Bull',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'venus',
    dateRange: { startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    traits: ['reliable', 'patient', 'practical', 'devoted', 'stable'],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces'],
  },
  gemini: {
    name: 'gemini',
    symbol: 'Twins',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    dateRange: { startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    traits: ['gentle', 'affectionate', 'curious', 'adaptable', 'quick-witted'],
    compatibility: ['libra', 'aquarius', 'aries', 'leo'],
  },
  cancer: {
    name: 'cancer',
    symbol: 'Crab',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'moon',
    dateRange: { startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    traits: ['tenacious', 'loyal', 'emotional', 'sympathetic', 'persuasive'],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo'],
  },
  leo: {
    name: 'leo',
    symbol: 'Lion',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'sun',
    dateRange: { startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    traits: ['creative', 'passionate', 'generous', 'warm-hearted', 'cheerful'],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra'],
  },
  virgo: {
    name: 'virgo',
    symbol: 'Maiden',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    dateRange: { startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    traits: ['loyal', 'analytical', 'kind', 'hardworking', 'practical'],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  },
  libra: {
    name: 'libra',
    symbol: 'Scales',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'venus',
    dateRange: { startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    traits: ['cooperative', 'diplomatic', 'gracious', 'fair-minded', 'social'],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  },
  scorpio: {
    name: 'scorpio',
    symbol: 'Scorpion',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'pluto',
    dateRange: { startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    traits: ['resourceful', 'brave', 'passionate', 'stubborn', 'strategic'],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn'],
  },
  sagittarius: {
    name: 'sagittarius',
    symbol: 'Archer',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'jupiter',
    dateRange: { startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    traits: ['generous', 'idealistic', 'great sense of humor', 'adventurous', 'philosophical'],
    compatibility: ['aries', 'leo', 'libra', 'aquarius'],
  },
  capricorn: {
    name: 'capricorn',
    symbol: 'Goat',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'saturn',
    dateRange: { startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    traits: ['responsible', 'disciplined', 'self-control', 'good managers', 'ambitious'],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces'],
  },
  aquarius: {
    name: 'aquarius',
    symbol: 'Water Bearer',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'uranus',
    dateRange: { startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    traits: ['progressive', 'original', 'independent', 'humanitarian', 'inventive'],
    compatibility: ['gemini', 'libra', 'aries', 'sagittarius'],
  },
  pisces: {
    name: 'pisces',
    symbol: 'Fish',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'neptune',
    dateRange: { startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    traits: ['compassionate', 'artistic', 'intuitive', 'gentle', 'wise'],
    compatibility: ['cancer', 'scorpio', 'taurus', 'capricorn'],
  },
};

/**
 * Helper function to get zodiac sign from birth date
 */
export function getZodiacSignFromDate(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of ZODIAC_SIGNS) {
    const { dateRange } = ZODIAC_SIGN_DATA[sign];
    const { startMonth, startDay, endMonth, endDay } = dateRange;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign;
      }
    } else if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign;
    }
  }

  return 'capricorn'; // Default for edge cases
}
