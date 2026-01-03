import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAnalytics } from '../../hooks/useAnalytics';

// Import step components
import { GenderSelect } from '../../components/onboarding/GenderSelect';
import { SocialProof } from '../../components/onboarding/SocialProof';
import { QuizQuestion } from '../../components/onboarding/QuizQuestion';
import { PositiveFeedback } from '../../components/onboarding/PositiveFeedback';
import { NameInput } from '../../components/onboarding/NameInput';
import { InterestsSelect } from '../../components/onboarding/InterestsSelect';
import { FeaturesShowcase } from '../../components/onboarding/FeaturesShowcase';
import { AnalysisLoading } from '../../components/onboarding/AnalysisLoading';
import { CelebrityComparison } from '../../components/onboarding/CelebrityComparison';
import { PricingPlans } from '../../components/onboarding/PricingPlans';

import './Onboarding.css';

// Quiz questions data
const QUIZ_QUESTIONS = [
  {
    question: 'O que mais te atrai na astrologia?',
    answers: [
      { id: 'autoconhecimento', label: 'Autoconhecimento' },
      { id: 'relacionamentos', label: 'Relacionamentos' },
      { id: 'carreira', label: 'Carreira e sucesso' },
      { id: 'espiritualidade', label: 'Espiritualidade' },
    ],
  },
  {
    question: 'Como você costuma tomar decisões importantes?',
    answers: [
      { id: 'intuicao', label: 'Sigo minha intuição' },
      { id: 'logica', label: 'Analiso logicamente' },
      { id: 'conselho', label: 'Peço conselhos' },
      { id: 'tempo', label: 'Deixo o tempo decidir' },
    ],
  },
  {
    question: 'O que você busca em um relacionamento?',
    answers: [
      { id: 'estabilidade', label: 'Estabilidade e segurança' },
      { id: 'aventura', label: 'Aventura e emoção' },
      { id: 'crescimento', label: 'Crescimento mútuo' },
      { id: 'liberdade', label: 'Liberdade e independência' },
    ],
  },
  {
    question: 'Como você lida com desafios?',
    answers: [
      { id: 'enfrenta', label: 'Enfrento de frente' },
      { id: 'planeja', label: 'Planejo com cuidado' },
      { id: 'adapta', label: 'Me adapto conforme necessário' },
      { id: 'evita', label: 'Prefiro evitar conflitos' },
    ],
  },
  {
    question: 'Qual elemento você mais se identifica?',
    answers: [
      { id: 'fogo', label: 'Fogo - Paixão e energia' },
      { id: 'terra', label: 'Terra - Estabilidade e praticidade' },
      { id: 'ar', label: 'Ar - Comunicação e ideias' },
      { id: 'agua', label: 'Água - Emoção e intuição' },
    ],
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const {
    state,
    canGoBack,
    previousStep,
    nextStep,
    setGender,
    setName,
    setInterests,
    setQuizAnswer,
  } = useOnboarding();
  const { trackStepView } = useAnalytics();

  const [quizIndex, setQuizIndex] = useState(0);
  const [interestsScreen, setInterestsScreen] = useState<1 | 2>(1);

  // Track step views
  useEffect(() => {
    trackStepView(state.currentStep);
  }, [state.currentStep, trackStepView]);

  // Handlers
  const handleGenderSelect = (gender: 'male' | 'female') => {
    setGender(gender);
    nextStep();
  };

  const handleQuizAnswer = (answerId: string) => {
    const question = QUIZ_QUESTIONS[quizIndex];
    setQuizAnswer(question.question, answerId);

    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizIndex(0);
      nextStep();
    }
  };

  const handleNameSubmit = (name: string) => {
    setName(name);
    nextStep();
  };

  const handleInterests = (selected: string[]) => {
    if (interestsScreen === 1) {
      setInterests(selected);
      setInterestsScreen(2);
    } else {
      setInterests([...state.userData.interests, ...selected]);
      setInterestsScreen(1);
      nextStep();
    }
  };

  const handleAnalysisQuestion = (_question: string, _answer: boolean) => {
    // Track analysis questions if needed
  };

  const handleSelectPlan = (_planId: string) => {
    // Handle plan selection
  };

  const handlePricingContinue = () => {
    // Navigate to dashboard or payment
    navigate('/dashboard');
  };

  // Render current step component
  const renderStep = () => {
    switch (state.currentStep) {
      case 'gender':
        return <GenderSelect onSelect={handleGenderSelect} />;
      case 'social-proof':
        return <SocialProof onContinue={nextStep} />;
      case 'preparation':
        return <div className="onboarding-step">Preparation Step</div>;
      case 'quiz':
        const currentQuestion = QUIZ_QUESTIONS[quizIndex];
        return (
          <QuizQuestion
            questionNumber={quizIndex + 1}
            totalQuestions={QUIZ_QUESTIONS.length}
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            answerType="text-list"
            onAnswer={handleQuizAnswer}
            onBack={quizIndex > 0 ? () => setQuizIndex(quizIndex - 1) : previousStep}
          />
        );
      case 'positive-feedback':
        return (
          <PositiveFeedback
            variant="ranking"
            percentage={78}
            onContinue={nextStep}
          />
        );
      case 'name-input':
        return (
          <NameInput
            onContinue={handleNameSubmit}
            initialValue={state.userData.name}
          />
        );
      case 'interests':
        return (
          <InterestsSelect
            screen={interestsScreen}
            onContinue={handleInterests}
            initialSelected={state.userData.interests}
          />
        );
      case 'features':
        return <FeaturesShowcase onContinue={nextStep} />;
      case 'analysis':
        return (
          <AnalysisLoading
            onComplete={nextStep}
            onQuestionAnswer={handleAnalysisQuestion}
          />
        );
      case 'celebrity-comparison':
        return (
          <CelebrityComparison
            userName={state.userData.name || 'Você'}
            onContinue={nextStep}
          />
        );
      case 'pricing':
        return (
          <PricingPlans
            onSelectPlan={handleSelectPlan}
            onContinue={handlePricingContinue}
          />
        );
      default:
        return <GenderSelect onSelect={handleGenderSelect} />;
    }
  };

  // Determine background variant based on step
  const getBackgroundVariant = () => {
    switch (state.currentStep) {
      case 'gender':
      case 'social-proof':
        return 'cosmic';
      case 'quiz':
      case 'positive-feedback':
        return 'nebula';
      case 'analysis':
        return 'aurora';
      case 'pricing':
        return 'stars';
      default:
        return 'cosmic';
    }
  };

  return (
    <OnboardingLayout
      progress={state.progress}
      showProgress={state.currentStep !== 'pricing'}
      showBackButton={canGoBack && state.currentStep !== 'analysis'}
      onBack={previousStep}
      backgroundVariant={getBackgroundVariant()}
    >
      <div className="onboarding-page" key={state.currentStep}>
        {renderStep()}
      </div>
    </OnboardingLayout>
  );
}

export default Onboarding;
