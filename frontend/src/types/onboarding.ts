/**
 * Onboarding Types
 * Types for the horoscope app onboarding flow
 */

export type Gender = 'male' | 'female';

export type OnboardingStep =
  | 'gender'
  | 'social-proof'
  | 'preparation'
  | 'quiz'
  | 'positive-feedback'
  | 'name-input'
  | 'interests'
  | 'features'
  | 'analysis'
  | 'celebrity-comparison'
  | 'pricing';

export interface UserData {
  gender: Gender | null;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  interests: string[];
  quizAnswers: Record<string, string>;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  userData: UserData;
  progress: number;
  quizProgress: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  category: 'personality' | 'lifestyle' | 'relationships' | 'goals';
}

export interface QuizOption {
  id: string;
  text: string;
  icon?: string;
}

export interface Interest {
  id: string;
  name: string;
  icon: string;
  category: 'love' | 'career' | 'health' | 'spirituality' | 'money' | 'personal-growth';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'weekly' | 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  savings?: string;
}

export interface Celebrity {
  id: string;
  name: string;
  imageUrl: string;
  zodiacSign: string;
  compatibility: number;
  description: string;
}

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  traits: string[];
}

export interface OnboardingContextValue {
  state: OnboardingState;
  setGender: (gender: Gender) => void;
  setName: (name: string) => void;
  setBirthDate: (date: string) => void;
  setBirthTime: (time: string) => void;
  setBirthPlace: (place: string) => void;
  setInterests: (interests: string[]) => void;
  setQuizAnswer: (questionId: string, answerId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
}
