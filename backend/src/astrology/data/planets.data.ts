/**
 * Astrological Planets Data
 *
 * This file contains comprehensive data for all celestial bodies used in astrology,
 * including the traditional planets, luminaries (Sun and Moon), and modern planets.
 */

import { Planet } from '../types/astrology.types';

/**
 * Interface for planet data
 */
export interface PlanetData {
  /** Display name in Portuguese */
  name: string;
  /** Unicode astrological symbol */
  symbol: string;
  /** Core meaning and influence */
  meaning: string;
  /** Detailed description of planetary influence */
  description: string;
  /** Zodiac signs ruled by this planet */
  rules: string[];
  /** Sign of exaltation */
  exaltation: string | null;
  /** Sign of detriment */
  detriment: string[];
  /** Sign of fall */
  fall: string | null;
  /** Keywords associated with this planet */
  keywords: string[];
  /** Average orbital period */
  orbitalPeriod: string;
  /** Whether it's a personal, social, or transpersonal planet */
  category: 'luminary' | 'personal' | 'social' | 'transpersonal';
  /** Retrograde characteristics */
  retrogradeEffect: string;
}

/**
 * Complete planetary data for all celestial bodies used in astrology
 */
export const PLANETS: Record<Planet, PlanetData> = {
  sun: {
    name: 'Sol',
    symbol: '\u2609',
    meaning: 'Ego, identidade, vitalidade',
    description: 'O Sol representa o nucleo do seu ser - sua essencia, proposito de vida e expressao do eu verdadeiro. E a fonte de energia vital e consciencia.',
    rules: ['leo'],
    exaltation: 'aries',
    detriment: ['aquarius'],
    fall: 'libra',
    keywords: ['identidade', 'ego', 'vitalidade', 'proposito', 'criatividade', 'lideranca', 'pai', 'autoridade'],
    orbitalPeriod: '1 ano',
    category: 'luminary',
    retrogradeEffect: 'O Sol nunca retrograda, mas eclipses solares trazem transformacoes profundas na identidade.',
  },

  moon: {
    name: 'Lua',
    symbol: '\u263d',
    meaning: 'Emocoes, instintos, subconsciente',
    description: 'A Lua governa o mundo emocional interno, memorias, habitos e necessidades de seguranca. Representa a mae, o lar e a vida domestica.',
    rules: ['cancer'],
    exaltation: 'taurus',
    detriment: ['capricorn'],
    fall: 'scorpio',
    keywords: ['emocoes', 'instintos', 'memoria', 'lar', 'mae', 'nutricao', 'habitos', 'intuicao'],
    orbitalPeriod: '28 dias',
    category: 'luminary',
    retrogradeEffect: 'A Lua nunca retrograda, mas as fases lunares influenciam ciclos emocionais e energeticos.',
  },

  mercury: {
    name: 'Mercurio',
    symbol: '\u263f',
    meaning: 'Comunicacao, intelecto, pensamento',
    description: 'Mercurio rege a mente racional, comunicacao, aprendizado e viagens curtas. E o mensageiro que conecta e transmite informacoes.',
    rules: ['gemini', 'virgo'],
    exaltation: 'virgo',
    detriment: ['sagittarius', 'pisces'],
    fall: 'pisces',
    keywords: ['comunicacao', 'intelecto', 'logica', 'aprendizado', 'viagens', 'irmaos', 'tecnologia', 'comercio'],
    orbitalPeriod: '88 dias',
    category: 'personal',
    retrogradeEffect: 'Retrogrado 3-4x ao ano. Causa mal-entendidos, atrasos em comunicacao, problemas tecnologicos. Bom para revisao e reflexao.',
  },

  venus: {
    name: 'Venus',
    symbol: '\u2640',
    meaning: 'Amor, beleza, valores, prazer',
    description: 'Venus governa o amor romantico, estetica, harmonia, luxo e como valorizamos a nos mesmos e aos outros. Representa atracao e prazer.',
    rules: ['taurus', 'libra'],
    exaltation: 'pisces',
    detriment: ['aries', 'scorpio'],
    fall: 'virgo',
    keywords: ['amor', 'beleza', 'arte', 'harmonia', 'valores', 'dinheiro', 'relacionamentos', 'prazer'],
    orbitalPeriod: '225 dias',
    category: 'personal',
    retrogradeEffect: 'Retrogrado a cada 18 meses. Traz reconsideracoes em relacionamentos, reencontros com ex, questoes de autoestima.',
  },

  mars: {
    name: 'Marte',
    symbol: '\u2642',
    meaning: 'Acao, energia, paixao, coragem',
    description: 'Marte representa a forca de vontade, iniciativa, desejo sexual e como perseguimos nossos objetivos. E o guerreiro interior.',
    rules: ['aries', 'scorpio'],
    exaltation: 'capricorn',
    detriment: ['libra', 'taurus'],
    fall: 'cancer',
    keywords: ['acao', 'energia', 'paixao', 'coragem', 'competicao', 'raiva', 'sexualidade', 'iniciativa'],
    orbitalPeriod: '687 dias',
    category: 'personal',
    retrogradeEffect: 'Retrogrado a cada 2 anos. Frustracao em iniciar projetos, raiva reprimida, questoes de assertividade.',
  },

  jupiter: {
    name: 'Jupiter',
    symbol: '\u2643',
    meaning: 'Expansao, sorte, sabedoria, crescimento',
    description: 'Jupiter e o grande benfeitor, trazendo abundancia, oportunidades e crescimento. Representa filosofia, religiao e viagens longas.',
    rules: ['sagittarius', 'pisces'],
    exaltation: 'cancer',
    detriment: ['gemini', 'virgo'],
    fall: 'capricorn',
    keywords: ['expansao', 'sorte', 'sabedoria', 'otimismo', 'filosofia', 'viagens', 'educacao', 'abundancia'],
    orbitalPeriod: '12 anos',
    category: 'social',
    retrogradeEffect: 'Retrogrado 4 meses ao ano. Internalizacao de crescimento espiritual, revisao de crencas e valores.',
  },

  saturn: {
    name: 'Saturno',
    symbol: '\u2644',
    meaning: 'Disciplina, responsabilidade, estrutura',
    description: 'Saturno ensina atraves de limitacoes e desafios. Representa maturidade, tempo, karma e as estruturas que construimos na vida.',
    rules: ['capricorn', 'aquarius'],
    exaltation: 'libra',
    detriment: ['cancer', 'leo'],
    fall: 'aries',
    keywords: ['disciplina', 'responsabilidade', 'tempo', 'karma', 'maturidade', 'limitacoes', 'estrutura', 'pai'],
    orbitalPeriod: '29 anos',
    category: 'social',
    retrogradeEffect: 'Retrogrado 4.5 meses ao ano. Revisao de responsabilidades, enfrentamento de medos, licoes karmicas.',
  },

  uranus: {
    name: 'Urano',
    symbol: '\u2645',
    meaning: 'Inovacao, rebeldia, mudanca subita',
    description: 'Urano traz revolucao, originalidade e libertacao das tradicoes. Representa genialidade, tecnologia e despertar espiritual.',
    rules: ['aquarius'],
    exaltation: 'scorpio',
    detriment: ['leo'],
    fall: 'taurus',
    keywords: ['inovacao', 'revolucao', 'liberdade', 'originalidade', 'tecnologia', 'despertar', 'surpresa', 'humanitarismo'],
    orbitalPeriod: '84 anos',
    category: 'transpersonal',
    retrogradeEffect: 'Retrogrado 5 meses ao ano. Transformacoes internas em areas de liberdade e autenticidade.',
  },

  neptune: {
    name: 'Netuno',
    symbol: '\u2646',
    meaning: 'Sonhos, intuicao, espiritualidade',
    description: 'Netuno dissolve fronteiras entre o material e o espiritual. Governa sonhos, imaginacao, misticismo e a conexao com o divino.',
    rules: ['pisces'],
    exaltation: 'leo',
    detriment: ['virgo'],
    fall: 'aquarius',
    keywords: ['sonhos', 'intuicao', 'espiritualidade', 'ilusao', 'arte', 'compaixao', 'transcendencia', 'misticismo'],
    orbitalPeriod: '165 anos',
    category: 'transpersonal',
    retrogradeEffect: 'Retrogrado 5 meses ao ano. Intensificacao da intuicao, confronto com ilusoes, despertar espiritual.',
  },

  pluto: {
    name: 'Plutao',
    symbol: '\u2647',
    meaning: 'Transformacao, poder, renascimento',
    description: 'Plutao representa morte e renascimento, transformacao profunda e poder. Revela o que esta oculto e forca evolucao da alma.',
    rules: ['scorpio'],
    exaltation: 'aries',
    detriment: ['taurus'],
    fall: 'libra',
    keywords: ['transformacao', 'poder', 'renascimento', 'morte', 'sombra', 'obsessao', 'regeneracao', 'controle'],
    orbitalPeriod: '248 anos',
    category: 'transpersonal',
    retrogradeEffect: 'Retrogrado 5 meses ao ano. Processos de cura profunda, confronto com traumas, transformacao interior.',
  },
};

/**
 * Lunar nodes - not planets but important in astrology
 */
export interface LunarNode {
  name: string;
  symbol: string;
  meaning: string;
  description: string;
}

export const LUNAR_NODES: { northNode: LunarNode; southNode: LunarNode } = {
  northNode: {
    name: 'Nodo Norte',
    symbol: '\u260a',
    meaning: 'Destino, evolucao, proposito de vida',
    description: 'O Nodo Norte indica a direcao karmica desta vida - as qualidades a desenvolver e o proposito evolutivo da alma.',
  },
  southNode: {
    name: 'Nodo Sul',
    symbol: '\u260b',
    meaning: 'Passado, talentos naturais, zona de conforto',
    description: 'O Nodo Sul representa habilidades trazidas de vidas passadas, padroes a transcender e a zona de conforto a abandonar.',
  },
};

/**
 * Chiron - the wounded healer
 */
export const CHIRON: PlanetData = {
  name: 'Quiron',
  symbol: '\u26b7',
  meaning: 'Ferida primordial, cura, sabedoria',
  description: 'Quiron representa nossa ferida mais profunda e tambem nosso maior potencial de cura. E o curador ferido que transforma dor em sabedoria.',
  rules: [],
  exaltation: null,
  detriment: [],
  fall: null,
  keywords: ['ferida', 'cura', 'sabedoria', 'mentor', 'dor', 'transcendencia', 'compaixao', 'vulnerabilidade'],
  orbitalPeriod: '50 anos',
  category: 'transpersonal',
  retrogradeEffect: 'Retrogrado 4 meses ao ano. Confronto com feridas profundas, oportunidade de cura interior.',
};

/**
 * Planetary aspects and their meanings
 */
export interface AspectData {
  name: string;
  degrees: number;
  orb: number;
  symbol: string;
  nature: 'harmonious' | 'challenging' | 'neutral';
  meaning: string;
}

export const PLANETARY_ASPECTS: Record<string, AspectData> = {
  conjunction: {
    name: 'Conjuncao',
    degrees: 0,
    orb: 8,
    symbol: '\u260c',
    nature: 'neutral',
    meaning: 'Fusao de energias. Pode ser harmonioso ou desafiador dependendo dos planetas envolvidos.',
  },
  sextile: {
    name: 'Sextil',
    degrees: 60,
    orb: 6,
    symbol: '\u26b9',
    nature: 'harmonious',
    meaning: 'Oportunidade e talento. Fluxo facil de energia entre os planetas.',
  },
  square: {
    name: 'Quadratura',
    degrees: 90,
    orb: 7,
    symbol: '\u25a1',
    nature: 'challenging',
    meaning: 'Tensao e desafio. Motiva acao e crescimento atraves de conflito.',
  },
  trine: {
    name: 'Trigono',
    degrees: 120,
    orb: 8,
    symbol: '\u25b3',
    nature: 'harmonious',
    meaning: 'Harmonia natural. Fluxo facil e talentos inatos.',
  },
  opposition: {
    name: 'Oposicao',
    degrees: 180,
    orb: 8,
    symbol: '\u260d',
    nature: 'challenging',
    meaning: 'Polaridade e consciencia. Requer integracao de energias opostas.',
  },
  quincunx: {
    name: 'Quincuncio',
    degrees: 150,
    orb: 3,
    symbol: '\u26bb',
    nature: 'challenging',
    meaning: 'Ajuste e adaptacao. Energias que nao se relacionam naturalmente.',
  },
};

/**
 * Planetary dignities - where planets are strong or weak
 */
export const PLANETARY_DIGNITIES = {
  essential: {
    domicile: 5, // Planet in its own sign
    exaltation: 4, // Planet exalted
    triplicity: 3, // Planet in same element
    term: 2, // Minor dignity
    face: 1, // Minor dignity
    detriment: -5, // Opposite of domicile
    fall: -4, // Opposite of exaltation
  },
  accidental: {
    angular: 5, // In houses 1, 4, 7, 10
    succedent: 3, // In houses 2, 5, 8, 11
    cadent: 1, // In houses 3, 6, 9, 12
  },
};

/**
 * Get all planets in a specific category
 */
export function getPlanetsByCategory(category: PlanetData['category']): Planet[] {
  return (Object.entries(PLANETS) as [Planet, PlanetData][])
    .filter(([_, data]) => data.category === category)
    .map(([planet]) => planet);
}

/**
 * Get the ruling planet for a zodiac sign
 */
export function getRulingPlanet(sign: string): Planet | null {
  for (const [planet, data] of Object.entries(PLANETS)) {
    if (data.rules.includes(sign)) {
      return planet as Planet;
    }
  }
  return null;
}

/**
 * Check if a planet is in dignity in a given sign
 */
export function getPlanetDignity(
  planet: Planet,
  sign: string,
): 'domicile' | 'exaltation' | 'detriment' | 'fall' | null {
  const planetData = PLANETS[planet];

  if (planetData.rules.includes(sign)) return 'domicile';
  if (planetData.exaltation === sign) return 'exaltation';
  if (planetData.detriment.includes(sign)) return 'detriment';
  if (planetData.fall === sign) return 'fall';

  return null;
}

/**
 * List of personal planets for quick reference
 */
export const PERSONAL_PLANETS: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars'];

/**
 * List of social planets
 */
export const SOCIAL_PLANETS: Planet[] = ['jupiter', 'saturn'];

/**
 * List of transpersonal/outer planets
 */
export const OUTER_PLANETS: Planet[] = ['uranus', 'neptune', 'pluto'];
