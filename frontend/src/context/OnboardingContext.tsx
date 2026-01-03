import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type {
  Gender,
  OnboardingStep,
  UserData,
  OnboardingState,
  OnboardingContextValue,
} from '../types/onboarding';

// Step order for navigation
const STEP_ORDER: OnboardingStep[] = [
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

// Calculate progress percentage based on current step
const calculateProgress = (step: OnboardingStep): number => {
  const stepIndex = STEP_ORDER.indexOf(step);
  return Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);
};

// Initial user data
const initialUserData: UserData = {
  gender: null,
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  interests: [],
  quizAnswers: {},
};

// Initial state
const initialState: OnboardingState = {
  currentStep: 'gender',
  userData: initialUserData,
  progress: calculateProgress('gender'),
  quizProgress: 0,
};

// Action types
type OnboardingAction =
  | { type: 'SET_GENDER'; payload: Gender }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_BIRTH_DATE'; payload: string }
  | { type: 'SET_BIRTH_TIME'; payload: string }
  | { type: 'SET_BIRTH_PLACE'; payload: string }
  | { type: 'SET_INTERESTS'; payload: string[] }
  | { type: 'SET_QUIZ_ANSWER'; payload: { questionId: string; answerId: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: OnboardingStep }
  | { type: 'RESET' };

// Reducer
function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_GENDER':
      return {
        ...state,
        userData: {
          ...state.userData,
          gender: action.payload,
        },
      };

    case 'SET_NAME':
      return {
        ...state,
        userData: {
          ...state.userData,
          name: action.payload,
        },
      };

    case 'SET_BIRTH_DATE':
      return {
        ...state,
        userData: {
          ...state.userData,
          birthDate: action.payload,
        },
      };

    case 'SET_BIRTH_TIME':
      return {
        ...state,
        userData: {
          ...state.userData,
          birthTime: action.payload,
        },
      };

    case 'SET_BIRTH_PLACE':
      return {
        ...state,
        userData: {
          ...state.userData,
          birthPlace: action.payload,
        },
      };

    case 'SET_INTERESTS':
      return {
        ...state,
        userData: {
          ...state.userData,
          interests: action.payload,
        },
      };

    case 'SET_QUIZ_ANSWER': {
      const { questionId, answerId } = action.payload;
      const newQuizAnswers = {
        ...state.userData.quizAnswers,
        [questionId]: answerId,
      };
      const totalQuestions = 5; // Adjust based on actual quiz length
      const answeredQuestions = Object.keys(newQuizAnswers).length;

      return {
        ...state,
        userData: {
          ...state.userData,
          quizAnswers: newQuizAnswers,
        },
        quizProgress: Math.round((answeredQuestions / totalQuestions) * 100),
      };
    }

    case 'NEXT_STEP': {
      const currentIndex = STEP_ORDER.indexOf(state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1);
      const nextStep = STEP_ORDER[nextIndex];

      return {
        ...state,
        currentStep: nextStep,
        progress: calculateProgress(nextStep),
      };
    }

    case 'PREVIOUS_STEP': {
      const currentIndex = STEP_ORDER.indexOf(state.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      const prevStep = STEP_ORDER[prevIndex];

      return {
        ...state,
        currentStep: prevStep,
        progress: calculateProgress(prevStep),
      };
    }

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
        progress: calculateProgress(action.payload),
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// Create context
const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// Provider props
interface OnboardingProviderProps {
  children: ReactNode;
}

// Provider component
export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const setGender = useCallback((gender: Gender) => {
    dispatch({ type: 'SET_GENDER', payload: gender });
  }, []);

  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name });
  }, []);

  const setBirthDate = useCallback((date: string) => {
    dispatch({ type: 'SET_BIRTH_DATE', payload: date });
  }, []);

  const setBirthTime = useCallback((time: string) => {
    dispatch({ type: 'SET_BIRTH_TIME', payload: time });
  }, []);

  const setBirthPlace = useCallback((place: string) => {
    dispatch({ type: 'SET_BIRTH_PLACE', payload: place });
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    dispatch({ type: 'SET_INTERESTS', payload: interests });
  }, []);

  const setQuizAnswer = useCallback((questionId: string, answerId: string) => {
    dispatch({ type: 'SET_QUIZ_ANSWER', payload: { questionId, answerId } });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  const resetOnboarding = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value: OnboardingContextValue = {
    state,
    setGender,
    setName,
    setBirthDate,
    setBirthTime,
    setBirthPlace,
    setInterests,
    setQuizAnswer,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use onboarding context
export function useOnboardingContext(): OnboardingContextValue {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }

  return context;
}

// Export context for testing purposes
export { OnboardingContext };
