/**
 * Dashboard Types
 * Types for the daily engagement dashboard
 */

export type MoonPhase =
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export type ZodiacSignId =
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

export interface ZodiacSignInfo {
  id: ZodiacSignId;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

export interface MoonInfo {
  phase: MoonPhase;
  sign: ZodiacSignId;
  signName: string;
  description: string;
}

export interface DailyHoroscope {
  sign: ZodiacSignId;
  signName: string;
  symbol: string;
  title: string;
  preview: string;
  fullText: string;
  date: string;
  energyRating?: number; // 1-5 stars
}

export interface EnergyRating {
  category: 'love' | 'work' | 'health' | 'money';
  label: string;
  stars: number; // 1-5
  icon: string;
}

export interface DailyEnergy {
  overall: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  ratings: EnergyRating[];
}

export interface CosmicEnergy {
  love: number;    // 0-100
  work: number;    // 0-100
  health: number;  // 0-100
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  isMilestone: boolean;
  milestoneMessage?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
}

export interface LuckyNumbersData {
  numbers: number[];
  generatedAt: string;
}

export interface CosmicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  daysUntil: number;
  type: 'retrograde' | 'eclipse' | 'new-moon' | 'full-moon' | 'conjunction' | 'other';
  icon: string;
}

export interface TarotCard {
  id: string;
  name: string;
  image: string;
  message: string;
  orientation: 'upright' | 'reversed';
}

export interface Biorhythm {
  physical: number;    // -100 to 100
  emotional: number;   // -100 to 100
  intellectual: number; // -100 to 100
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  sunSign: ZodiacSignId;
  moonSign?: ZodiacSignId;
  risingSign?: ZodiacSignId;
  avatarUrl?: string;
}

export interface DashboardData {
  user: UserProfile;
  moon: MoonInfo;
  horoscope: DailyHoroscope;
  energy: DailyEnergy;
  cosmicEnergy?: CosmicEnergy;
  streak: StreakInfo;
  luckyNumbers: LuckyNumbersData;
  cosmicEvents: CosmicEvent[];
  tarotCard?: TarotCard;
  biorhythm?: Biorhythm;
  greeting: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    message: string;
  };
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
}
