import type { ZodiacSign } from '../types/onboarding';

/**
 * Zodiac sign data
 */
export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '\u2648',
    element: 'fire',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    traits: ['Bold', 'Ambitious', 'Energetic', 'Confident', 'Passionate'],
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '\u2649',
    element: 'earth',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    traits: ['Reliable', 'Patient', 'Devoted', 'Practical', 'Sensual'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '\u264A',
    element: 'air',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    traits: ['Curious', 'Adaptable', 'Witty', 'Expressive', 'Social'],
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '\u264B',
    element: 'water',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    traits: ['Intuitive', 'Loyal', 'Protective', 'Emotional', 'Nurturing'],
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '\u264C',
    element: 'fire',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    traits: ['Creative', 'Generous', 'Warm-hearted', 'Dramatic', 'Leader'],
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '\u264D',
    element: 'earth',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    traits: ['Analytical', 'Practical', 'Hardworking', 'Detail-oriented', 'Kind'],
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '\u264E',
    element: 'air',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    traits: ['Diplomatic', 'Fair', 'Social', 'Gracious', 'Idealistic'],
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '\u264F',
    element: 'water',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    traits: ['Passionate', 'Resourceful', 'Brave', 'Mysterious', 'Intense'],
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '\u2650',
    element: 'fire',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    traits: ['Optimistic', 'Adventurous', 'Honest', 'Philosophical', 'Free-spirited'],
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '\u2651',
    element: 'earth',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    traits: ['Disciplined', 'Responsible', 'Ambitious', 'Practical', 'Patient'],
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '\u2652',
    element: 'air',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Inventive'],
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '\u2653',
    element: 'water',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    traits: ['Intuitive', 'Artistic', 'Compassionate', 'Wise', 'Gentle'],
  },
];

/**
 * Element colors and properties
 */
export const ELEMENT_PROPERTIES = {
  fire: {
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)',
    description: 'Passionate, dynamic, and temperamental',
    compatibleElements: ['fire', 'air'],
  },
  earth: {
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    description: 'Grounded, practical, and reliable',
    compatibleElements: ['earth', 'water'],
  },
  air: {
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    description: 'Intellectual, social, and communicative',
    compatibleElements: ['air', 'fire'],
  },
  water: {
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488, #6366F1)',
    description: 'Emotional, intuitive, and mysterious',
    compatibleElements: ['water', 'earth'],
  },
};

/**
 * Get zodiac sign from birth date
 */
export function getZodiacSign(birthDate: string): ZodiacSign | null {
  if (!birthDate) return null;

  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  for (const sign of ZODIAC_SIGNS) {
    const { start, end } = sign.dateRange;

    // Handle Capricorn (spans December-January)
    if (sign.id === 'capricorn') {
      if ((month === 12 && day >= start.day) || (month === 1 && day <= end.day)) {
        return sign;
      }
    } else {
      // Normal date range check
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day)
      ) {
        return sign;
      }
    }
  }

  return null;
}

/**
 * Get zodiac sign by ID
 */
export function getZodiacSignById(id: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((sign) => sign.id === id);
}

/**
 * Get element properties for a zodiac sign
 */
export function getZodiacElement(signId: string) {
  const sign = getZodiacSignById(signId);
  if (!sign) return null;

  return ELEMENT_PROPERTIES[sign.element];
}

/**
 * Calculate compatibility between two zodiac signs
 */
export function calculateCompatibility(sign1Id: string, sign2Id: string): number {
  const sign1 = getZodiacSignById(sign1Id);
  const sign2 = getZodiacSignById(sign2Id);

  if (!sign1 || !sign2) return 0;

  const element1Props = ELEMENT_PROPERTIES[sign1.element];

  // Same sign = high compatibility
  if (sign1Id === sign2Id) {
    return 85 + Math.floor(Math.random() * 10);
  }

  // Same element = good compatibility
  if (sign1.element === sign2.element) {
    return 75 + Math.floor(Math.random() * 15);
  }

  // Compatible elements = decent compatibility
  if (element1Props.compatibleElements.includes(sign2.element)) {
    return 60 + Math.floor(Math.random() * 20);
  }

  // Different elements = lower compatibility
  return 40 + Math.floor(Math.random() * 25);
}

/**
 * Get daily lucky number based on birth date and current date
 */
export function getLuckyNumber(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();

  const seed =
    birth.getDate() +
    birth.getMonth() +
    today.getDate() +
    today.getMonth() +
    today.getFullYear();

  return (seed % 9) + 1;
}

/**
 * Get lucky color based on zodiac sign and day
 */
export function getLuckyColor(signId: string): string {
  const sign = getZodiacSignById(signId);
  if (!sign) return '#6B46C1';

  const colors: Record<string, string[]> = {
    fire: ['#EF4444', '#F59E0B', '#DC2626', '#FBBF24'],
    earth: ['#10B981', '#059669', '#047857', '#34D399'],
    air: ['#3B82F6', '#8B5CF6', '#6366F1', '#A78BFA'],
    water: ['#0D9488', '#6366F1', '#14B8A6', '#818CF8'],
  };

  const elementColors = colors[sign.element];
  const dayIndex = new Date().getDay();

  return elementColors[dayIndex % elementColors.length];
}

/**
 * Format zodiac date range for display
 */
export function formatDateRange(sign: ZodiacSign): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const { start, end } = sign.dateRange;

  return `${months[start.month - 1]} ${start.day} - ${months[end.month - 1]} ${end.day}`;
}
