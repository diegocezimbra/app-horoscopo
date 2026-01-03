import { useMemo } from 'react';
import { useOnboardingContext } from '../context/OnboardingContext';
import type { OnboardingStep, ZodiacSign } from '../types/onboarding';
import { getZodiacSign, getZodiacElement } from '../utils/zodiac';

/**
 * Custom hook for onboarding logic and derived state
 */
export function useOnboarding() {
  const context = useOnboardingContext();
  const { state } = context;

  // Check if current step is complete
  const isStepComplete = useMemo(() => {
    const { userData, currentStep } = state;

    switch (currentStep) {
      case 'gender':
        return userData.gender !== null;
      case 'name-input':
        return userData.name.trim().length >= 2;
      case 'interests':
        return userData.interests.length >= 1;
      case 'quiz':
        return Object.keys(userData.quizAnswers).length >= 5;
      default:
        return true;
    }
  }, [state]);

  // Get user's zodiac sign
  const zodiacSign = useMemo((): ZodiacSign | null => {
    if (!state.userData.birthDate) return null;
    return getZodiacSign(state.userData.birthDate);
  }, [state.userData.birthDate]);

  // Get zodiac element
  const zodiacElement = useMemo(() => {
    if (!zodiacSign) return null;
    return getZodiacElement(zodiacSign.id);
  }, [zodiacSign]);

  // Check if user can proceed to next step
  const canProceed = useMemo(() => {
    return isStepComplete;
  }, [isStepComplete]);

  // Check if user can go back
  const canGoBack = useMemo(() => {
    return state.currentStep !== 'gender';
  }, [state.currentStep]);

  // Get step number (1-indexed for display)
  const stepNumber = useMemo(() => {
    const steps: OnboardingStep[] = [
      'gender',
      'social-proof',
      'preparation',
      'quiz',
      'positive-feedback',
      'name-input',
      'interests',
      'features',
      'analysis',
      'celebrity-comparison',
      'pricing',
    ];
    return steps.indexOf(state.currentStep) + 1;
  }, [state.currentStep]);

  // Total number of steps
  const totalSteps = 11;

  // Check if onboarding is complete
  const isComplete = useMemo(() => {
    return state.currentStep === 'pricing';
  }, [state.currentStep]);

  // Get personalized greeting
  const greeting = useMemo(() => {
    const { name } = state.userData;
    if (!name) return '';

    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 18) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    return `${timeGreeting}, ${name}`;
  }, [state.userData.name, state.userData.gender]);

  return {
    ...context,
    isStepComplete,
    zodiacSign,
    zodiacElement,
    canProceed,
    canGoBack,
    stepNumber,
    totalSteps,
    isComplete,
    greeting,
  };
}
