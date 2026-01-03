/**
 * Profile Types
 * Types for the horoscope app profile and compatibility features
 */

export type ProfileType = 'main' | 'partner' | 'child' | 'friend' | 'crush' | 'celebrity';

export type ZodiacSignId =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface ZodiacInfo {
  id: ZodiacSignId;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  emoji: string;
}

export interface Profile {
  id: string;
  type: ProfileType;
  name: string;
  avatarUrl?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  sunSign: ZodiacSignId;
  moonSign?: ZodiacSignId;
  ascendant?: ZodiacSignId;
  traits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  type: ProfileType;
  name: string;
  avatarUrl?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
}

export interface CompatibilityCategory {
  id: string;
  name: string;
  icon: string;
  score: number;
  description?: string;
}

export interface CompatibilityStrength {
  id: string;
  text: string;
}

export interface CompatibilityChallenge {
  id: string;
  text: string;
}

export interface CompatibilityResult {
  id: string;
  profile1: Profile | { name: string; sign: ZodiacSignId };
  profile2: Profile | { name: string; sign: ZodiacSignId };
  overallScore: number;
  categories: CompatibilityCategory[];
  strengths: CompatibilityStrength[];
  challenges: CompatibilityChallenge[];
  advice: string;
  createdAt: string;
}

export interface RecentComparison {
  id: string;
  name1: string;
  sign1: ZodiacSignId;
  name2: string;
  sign2: ZodiacSignId;
  score: number;
  createdAt: string;
}

export interface ProfilesState {
  profiles: Profile[];
  mainProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

export interface CompatibilityState {
  currentResult: CompatibilityResult | null;
  recentComparisons: RecentComparison[];
  isLoading: boolean;
  error: string | null;
}

export const ZODIAC_SIGNS: Record<ZodiacSignId, ZodiacInfo> = {
  aries: { id: 'aries', name: 'Aries', symbol: '\u2648', element: 'fire', emoji: '\u2648' },
  taurus: { id: 'taurus', name: 'Touro', symbol: '\u2649', element: 'earth', emoji: '\u2649' },
  gemini: { id: 'gemini', name: 'Gemeos', symbol: '\u264A', element: 'air', emoji: '\u264A' },
  cancer: { id: 'cancer', name: 'Cancer', symbol: '\u264B', element: 'water', emoji: '\u264B' },
  leo: { id: 'leo', name: 'Leao', symbol: '\u264C', element: 'fire', emoji: '\u264C' },
  virgo: { id: 'virgo', name: 'Virgem', symbol: '\u264D', element: 'earth', emoji: '\u264D' },
  libra: { id: 'libra', name: 'Libra', symbol: '\u264E', element: 'air', emoji: '\u264E' },
  scorpio: { id: 'scorpio', name: 'Escorpiao', symbol: '\u264F', element: 'water', emoji: '\u264F' },
  sagittarius: { id: 'sagittarius', name: 'Sagitario', symbol: '\u2650', element: 'fire', emoji: '\u2650' },
  capricorn: { id: 'capricorn', name: 'Capricornio', symbol: '\u2651', element: 'earth', emoji: '\u2651' },
  aquarius: { id: 'aquarius', name: 'Aquario', symbol: '\u2652', element: 'air', emoji: '\u2652' },
  pisces: { id: 'pisces', name: 'Peixes', symbol: '\u2653', element: 'water', emoji: '\u2653' },
};

export const PROFILE_TYPE_INFO: Record<ProfileType, { label: string; icon: string; description: string }> = {
  main: { label: 'Meu Perfil', icon: '\u2B50', description: 'Seu perfil principal' },
  partner: { label: 'Parceiro(a)', icon: '\u2764\uFE0F', description: 'Namorado(a), marido, esposa' },
  child: { label: 'Filho(a)', icon: '\uD83D\uDC76', description: 'Filhos ou criancas proximas' },
  friend: { label: 'Amigo(a)', icon: '\uD83E\uDD1D', description: 'Amigos e colegas' },
  crush: { label: 'Crush', icon: '\uD83D\uDE0D', description: 'Paixonite ou interesse' },
  celebrity: { label: 'Celebridade', icon: '\uD83C\uDF1F', description: 'Famosos e celebridades' },
};
