/**
 * Complete Zodiac Signs Data
 *
 * This file contains comprehensive data for all 12 zodiac signs,
 * including their symbols, elements, modalities, traits, and more.
 * Used throughout the astrology engine for calculations and interpretations.
 */

import { ZodiacSign, Element, Modality, Planet } from '../types/astrology.types';

/**
 * Interface for zodiac sign date range
 */
export interface DateRange {
  start: { month: number; day: number };
  end: { month: number; day: number };
}

/**
 * Interface for complete zodiac sign data
 */
export interface ZodiacSignData {
  /** Display name in Portuguese */
  name: string;
  /** Unicode zodiac symbol */
  symbol: string;
  /** Associated element (fire, earth, air, water) */
  element: Element;
  /** Modality (cardinal, fixed, mutable) */
  modality: Modality;
  /** Ruling planet */
  rulingPlanet: Planet;
  /** Date range for this sign */
  dateRange: DateRange;
  /** Positive personality traits */
  traits: string[];
  /** Challenging personality aspects */
  weaknesses: string[];
  /** Compatible signs */
  compatibility: ZodiacSign[];
  /** Lucky numbers */
  luckyNumbers: number[];
  /** Lucky colors */
  luckyColors: string[];
  /** Famous celebrities with this sign */
  celebrities: string[];
  /** Ruling body part */
  bodyPart: string;
  /** Associated gemstone */
  gemstone: string;
  /** Lucky day of the week */
  luckyDay: string;
  /** Brief mystical description */
  description: string;
}

/**
 * Complete zodiac signs database with all 12 signs
 */
export const ZODIAC_SIGNS: Record<ZodiacSign, ZodiacSignData> = {
  aries: {
    name: 'Aries',
    symbol: '\u2648',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'mars',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    traits: ['corajoso', 'determinado', 'confiante', 'entusiasta', 'otimista', 'honesto', 'apaixonado'],
    weaknesses: ['impaciente', 'temperamental', 'agressivo', 'impulsivo', 'competitivo demais'],
    compatibility: ['leo', 'sagittarius', 'gemini', 'aquarius'],
    luckyNumbers: [1, 8, 17, 9, 27],
    luckyColors: ['vermelho', 'laranja', 'amarelo'],
    celebrities: ['Lady Gaga', 'Robert Downey Jr.', 'Mariah Carey', 'Emma Watson', 'Elton John'],
    bodyPart: 'cabeca e rosto',
    gemstone: 'diamante',
    luckyDay: 'terca-feira',
    description: 'O pioneiro do zodiaco, Aries lidera com coragem e determinacao. Sua energia ardente inspira os outros a seguir em frente.',
  },

  taurus: {
    name: 'Touro',
    symbol: '\u2649',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'venus',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    traits: ['confiavel', 'paciente', 'pratico', 'dedicado', 'responsavel', 'estavel', 'sensual'],
    weaknesses: ['teimoso', 'possessivo', 'inflexivel', 'materialista', 'preguicoso'],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces'],
    luckyNumbers: [2, 6, 9, 12, 24],
    luckyColors: ['verde', 'rosa', 'branco'],
    celebrities: ['Adele', 'Dwayne Johnson', 'David Beckham', 'Megan Fox', 'Cher'],
    bodyPart: 'pescoco e garganta',
    gemstone: 'esmeralda',
    luckyDay: 'sexta-feira',
    description: 'O construtor do zodiaco, Touro valoriza estabilidade e conforto. Sua determinacao inabalavel transforma sonhos em realidade.',
  },

  gemini: {
    name: 'Gemeos',
    symbol: '\u264a',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    traits: ['versatil', 'curioso', 'comunicativo', 'inteligente', 'adaptavel', 'espirituoso', 'jovial'],
    weaknesses: ['indeciso', 'inconsistente', 'nervoso', 'superficial', 'inquieto'],
    compatibility: ['libra', 'aquarius', 'aries', 'leo'],
    luckyNumbers: [3, 5, 7, 12, 23],
    luckyColors: ['amarelo', 'verde claro', 'laranja'],
    celebrities: ['Angelina Jolie', 'Johnny Depp', 'Kanye West', 'Marilyn Monroe', 'Natalie Portman'],
    bodyPart: 'bracos, maos e pulmoes',
    gemstone: 'agata',
    luckyDay: 'quarta-feira',
    description: 'O comunicador do zodiaco, Gemeos conecta mundos com palavras e ideias. Sua mente agil danca entre possibilidades infinitas.',
  },

  cancer: {
    name: 'Cancer',
    symbol: '\u264b',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'moon',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    traits: ['intuitivo', 'emocional', 'protetor', 'leal', 'carinhoso', 'imaginativo', 'persistente'],
    weaknesses: ['melancolico', 'pessimista', 'desconfiado', 'manipulador', 'inseguro'],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo'],
    luckyNumbers: [2, 7, 11, 16, 20],
    luckyColors: ['branco', 'prata', 'azul palido'],
    celebrities: ['Selena Gomez', 'Tom Hanks', 'Ariana Grande', 'Elon Musk', 'Meryl Streep'],
    bodyPart: 'peito e estomago',
    gemstone: 'perola',
    luckyDay: 'segunda-feira',
    description: 'O guardiao do zodiaco, Cancer nutre e protege com amor incondicional. Sua intuicao profunda revela verdades ocultas.',
  },

  leo: {
    name: 'Leao',
    symbol: '\u264c',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'sun',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    traits: ['generoso', 'caloroso', 'leal', 'criativo', 'entusiasmado', 'confiante', 'carismatico'],
    weaknesses: ['arrogante', 'teimoso', 'egocentrino', 'dramatico', 'dominador'],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra'],
    luckyNumbers: [1, 4, 10, 13, 19],
    luckyColors: ['dourado', 'laranja', 'vermelho'],
    celebrities: ['Barack Obama', 'Jennifer Lopez', 'Madonna', 'Daniel Radcliffe', 'Mick Jagger'],
    bodyPart: 'coracao e coluna',
    gemstone: 'rubi',
    luckyDay: 'domingo',
    description: 'O rei do zodiaco, Leao brilha com majestade natural. Seu coracao generoso aquece todos ao seu redor.',
  },

  virgo: {
    name: 'Virgem',
    symbol: '\u264d',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    traits: ['analitico', 'pratico', 'meticuloso', 'confiavel', 'trabalhador', 'modesto', 'inteligente'],
    weaknesses: ['critico demais', 'preocupado', 'timido', 'perfeccionista', 'antiquado'],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio'],
    luckyNumbers: [5, 14, 15, 23, 32],
    luckyColors: ['verde', 'marrom', 'bege'],
    celebrities: ['Beyonce', 'Keanu Reeves', 'Zendaya', 'Michael Jackson', 'Freddie Mercury'],
    bodyPart: 'sistema digestivo',
    gemstone: 'safira',
    luckyDay: 'quarta-feira',
    description: 'O curador do zodiaco, Virgem aperfeiçoa com dedicacao e amor. Sua atencao aos detalhes cria harmonia no caos.',
  },

  libra: {
    name: 'Libra',
    symbol: '\u264e',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'venus',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    traits: ['diplomatico', 'justo', 'social', 'charmoso', 'harmonioso', 'romantico', 'gracioso'],
    weaknesses: ['indeciso', 'evita conflitos', 'superficial', 'dependente', 'manipulador'],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius'],
    luckyNumbers: [4, 6, 13, 15, 24],
    luckyColors: ['rosa', 'azul claro', 'verde'],
    celebrities: ['Kim Kardashian', 'Bruno Mars', 'Will Smith', 'Kate Winslet', 'John Lennon'],
    bodyPart: 'rins e regiao lombar',
    gemstone: 'opala',
    luckyDay: 'sexta-feira',
    description: 'O harmonizador do zodiaco, Libra busca beleza e equilibrio em tudo. Sua diplomacia natural une coracoes.',
  },

  scorpio: {
    name: 'Escorpiao',
    symbol: '\u264f',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'pluto',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    traits: ['apaixonado', 'determinado', 'corajoso', 'leal', 'intuitivo', 'magnetico', 'misterioso'],
    weaknesses: ['ciumento', 'vingativo', 'obsessivo', 'desconfiado', 'controlador'],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn'],
    luckyNumbers: [8, 11, 18, 22, 29],
    luckyColors: ['vermelho escuro', 'preto', 'roxo'],
    celebrities: ['Leonardo DiCaprio', 'Katy Perry', 'Ryan Gosling', 'Drake', 'Julia Roberts'],
    bodyPart: 'orgaos reprodutivos',
    gemstone: 'topazio',
    luckyDay: 'terca-feira',
    description: 'O transformador do zodiaco, Escorpiao mergulha nas profundezas da alma. Seu poder renasce das cinzas.',
  },

  sagittarius: {
    name: 'Sagitario',
    symbol: '\u2650',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'jupiter',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    traits: ['otimista', 'filosofico', 'aventureiro', 'generoso', 'honesto', 'entusiasmado', 'livre'],
    weaknesses: ['impaciente', 'irresponsavel', 'superficial', 'tatico demais', 'inquieto'],
    compatibility: ['aries', 'leo', 'libra', 'aquarius'],
    luckyNumbers: [3, 7, 9, 12, 21],
    luckyColors: ['roxo', 'azul royal', 'turquesa'],
    celebrities: ['Taylor Swift', 'Brad Pitt', 'Miley Cyrus', 'Jay-Z', 'Nicki Minaj'],
    bodyPart: 'quadris e coxas',
    gemstone: 'turquesa',
    luckyDay: 'quinta-feira',
    description: 'O explorador do zodiaco, Sagitario busca verdade e aventura. Sua flecha mira sempre no horizonte distante.',
  },

  capricorn: {
    name: 'Capricornio',
    symbol: '\u2651',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'saturn',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    traits: ['responsavel', 'disciplinado', 'ambicioso', 'pratico', 'paciente', 'cuidadoso', 'perseverante'],
    weaknesses: ['pessimista', 'teimoso', 'melancolico', 'desconfiado', 'materialista'],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces'],
    luckyNumbers: [4, 8, 13, 22, 26],
    luckyColors: ['marrom', 'preto', 'cinza'],
    celebrities: ['Michelle Obama', 'Denzel Washington', 'LeBron James', 'Kate Middleton', 'Elvis Presley'],
    bodyPart: 'joelhos e ossos',
    gemstone: 'granada',
    luckyDay: 'sabado',
    description: 'O mestre do zodiaco, Capricornio escala montanhas com paciencia. Seu legado e construido tijolo por tijolo.',
  },

  aquarius: {
    name: 'Aquario',
    symbol: '\u2652',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'uranus',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    traits: ['inovador', 'original', 'humanitario', 'independente', 'progressista', 'intelectual', 'visionario'],
    weaknesses: ['imprevisivel', 'distante', 'teimoso', 'rebelde', 'impessoal'],
    compatibility: ['gemini', 'libra', 'aries', 'sagittarius'],
    luckyNumbers: [4, 7, 11, 22, 29],
    luckyColors: ['azul eletrico', 'turquesa', 'prata'],
    celebrities: ['Oprah Winfrey', 'Harry Styles', 'Justin Timberlake', 'Shakira', 'Ed Sheeran'],
    bodyPart: 'tornozelos e sistema circulatorio',
    gemstone: 'ametista',
    luckyDay: 'sabado',
    description: 'O visionario do zodiaco, Aquario sonha com um mundo melhor. Sua mente revolucionaria quebra paradigmas.',
  },

  pisces: {
    name: 'Peixes',
    symbol: '\u2653',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'neptune',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    traits: ['compassivo', 'artistico', 'intuitivo', 'gentil', 'sabio', 'musical', 'romantico'],
    weaknesses: ['escapista', 'vitimista', 'credulidade', 'melancolico', 'idealiasta demais'],
    compatibility: ['cancer', 'scorpio', 'taurus', 'capricorn'],
    luckyNumbers: [3, 9, 12, 15, 18],
    luckyColors: ['violeta', 'azul marinho', 'verde agua'],
    celebrities: ['Rihanna', 'Justin Bieber', 'Steve Jobs', 'Albert Einstein', 'Kurt Cobain'],
    bodyPart: 'pes e sistema linfatico',
    gemstone: 'agua-marinha',
    luckyDay: 'quinta-feira',
    description: 'O sonhador do zodiaco, Peixes navega entre mundos visiveis e invisiveis. Sua alma poetica sente o que outros nao veem.',
  },
};

/**
 * Get zodiac sign from a given date
 * @param month - Month number (1-12)
 * @param day - Day of the month
 * @returns The zodiac sign for that date
 */
export function getZodiacSignFromDate(month: number, day: number): ZodiacSign {
  const signs: ZodiacSign[] = [
    'capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini',
    'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius',
  ];

  for (const sign of signs) {
    const { dateRange } = ZODIAC_SIGNS[sign];
    const { start, end } = dateRange;

    // Handle signs that span year boundary (Capricorn)
    if (start.month > end.month) {
      if ((month === start.month && day >= start.day) || (month === end.month && day <= end.day)) {
        return sign;
      }
    } else {
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month)
      ) {
        return sign;
      }
    }
  }

  // Default fallback (should never happen with proper dates)
  return 'capricorn';
}

/**
 * Element compatibility matrix
 * Fire + Fire = Passionate
 * Fire + Air = Dynamic
 * Earth + Earth = Stable
 * Earth + Water = Nurturing
 * Air + Air = Intellectual
 * Water + Water = Emotional
 */
export const ELEMENT_COMPATIBILITY: Record<Element, Record<Element, number>> = {
  fire: { fire: 90, earth: 50, air: 80, water: 40 },
  earth: { fire: 50, earth: 85, air: 45, water: 75 },
  air: { fire: 80, earth: 45, air: 85, water: 55 },
  water: { fire: 40, earth: 75, air: 55, water: 90 },
};

/**
 * Modality compatibility matrix
 * Same modality = challenging but dynamic
 * Cardinal + Fixed = complementary
 * Fixed + Mutable = stable growth
 * Mutable + Cardinal = adaptable leadership
 */
export const MODALITY_COMPATIBILITY: Record<Modality, Record<Modality, number>> = {
  cardinal: { cardinal: 60, fixed: 75, mutable: 80 },
  fixed: { cardinal: 75, fixed: 65, mutable: 70 },
  mutable: { cardinal: 80, fixed: 70, mutable: 75 },
};

/**
 * Array of all zodiac signs in order
 */
export const ZODIAC_SIGN_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

/**
 * Get the opposite sign (180 degrees apart)
 */
export function getOppositeSign(sign: ZodiacSign): ZodiacSign {
  const index = ZODIAC_SIGN_ORDER.indexOf(sign);
  return ZODIAC_SIGN_ORDER[(index + 6) % 12];
}

/**
 * Get signs that form a trine (120 degrees apart, same element)
 */
export function getTrineSign(sign: ZodiacSign): ZodiacSign[] {
  const index = ZODIAC_SIGN_ORDER.indexOf(sign);
  return [
    ZODIAC_SIGN_ORDER[(index + 4) % 12],
    ZODIAC_SIGN_ORDER[(index + 8) % 12],
  ];
}

/**
 * Get signs that form a square (90 degrees apart, same modality)
 */
export function getSquareSigns(sign: ZodiacSign): ZodiacSign[] {
  const index = ZODIAC_SIGN_ORDER.indexOf(sign);
  return [
    ZODIAC_SIGN_ORDER[(index + 3) % 12],
    ZODIAC_SIGN_ORDER[(index + 9) % 12],
  ];
}

/**
 * Get sextile signs (60 degrees apart)
 */
export function getSextileSigns(sign: ZodiacSign): ZodiacSign[] {
  const index = ZODIAC_SIGN_ORDER.indexOf(sign);
  return [
    ZODIAC_SIGN_ORDER[(index + 2) % 12],
    ZODIAC_SIGN_ORDER[(index + 10) % 12],
  ];
}
