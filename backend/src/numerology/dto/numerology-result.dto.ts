import { NumerologyMeaning } from '../data/numbers.data';
import { MasterNumberMeaning } from '../data/master-numbers.data';

export interface NumberInterpretation {
  number: number;
  isMasterNumber: boolean;
  meaning: NumerologyMeaning | MasterNumberMeaning;
  personalMessage: string;
}

export interface LifePathInterpretation extends NumberInterpretation {
  type: 'lifePath';
  description: string;
  yearlyInfluence: string;
}

export interface DestinyInterpretation extends NumberInterpretation {
  type: 'destiny';
  description: string;
  careerGuidance: string;
}

export interface SoulUrgeInterpretation extends NumberInterpretation {
  type: 'soulUrge';
  description: string;
  innerDesires: string;
}

export interface PersonalityInterpretation extends NumberInterpretation {
  type: 'personality';
  description: string;
  firstImpression: string;
}

export interface BirthdayInterpretation extends NumberInterpretation {
  type: 'birthday';
  description: string;
  specialTalent: string;
}

export interface DailyNumerologyReading {
  personalNumber: number;
  universalDayNumber: number;
  combinedEnergy: number;
  dailyTheme: string;
  guidance: string;
  luckyHours: string[];
  colorOfTheDay: string;
  affirmation: string;
  warning: string;
  opportunities: string[];
}

export interface NumerologyProfile {
  name: string;
  birthDate: string;
  lifePath: LifePathInterpretation;
  destiny: DestinyInterpretation;
  soulUrge: SoulUrgeInterpretation;
  personality: PersonalityInterpretation;
  birthday: BirthdayInterpretation;
  coreNumbersSummary: string;
  compatibilityInsights: string;
  personalYearNumber: number;
  personalYearMessage: string;
  spiritualGuidance: string;
  generatedAt: string;
}
