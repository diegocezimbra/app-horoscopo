/**
 * ==============================================================================
 * AnalysisLoading Component
 * ==============================================================================
 *
 * The KEY engagement screen that shows analysis progress and asks questions
 * while "analyzing" the user's astrological data. Creates maximum anticipation.
 *
 * Features:
 * - Multi-step progress with checkmarks
 * - Timed progression through steps
 * - Popup questions during loading
 * - Testimonial carousel
 * - Smooth animations
 *
 * @module components/onboarding
 */
import React, { useState, useEffect, useCallback } from 'react';
import './AnalysisLoading.css';

export interface AnalysisLoadingProps {
  onComplete: () => void;
  onQuestionAnswer: (question: string, answer: boolean) => void;
}

interface Step {
  id: string;
  text: string;
  duration: number; // in milliseconds
}

interface Question {
  id: string;
  text: string;
  showAtStep: number; // 0-indexed, shows during this step
  showAtProgress: number; // Show when step progress reaches this percentage
}

const STEPS: Step[] = [
  { id: 'responses', text: 'Respostas analisadas', duration: 2000 },
  { id: 'planetary', text: 'Calcular posicoes planetarias', duration: 4000 },
  { id: 'houses', text: 'Analisar casas astrologicas', duration: 3500 },
  { id: 'chart', text: 'Preparar seu mapa personalizado', duration: 3000 },
];

const QUESTIONS: Question[] = [
  { id: 'distracted', text: 'Distraiu-se enquanto respondia?', showAtStep: 1, showAtProgress: 30 },
  { id: 'previous', text: 'Ja fez analises astrologicas antes?', showAtStep: 2, showAtProgress: 40 },
  { id: 'believe', text: 'Acredita em astrologia?', showAtStep: 3, showAtProgress: 30 },
];

const TESTIMONIALS = [
  {
    id: 1,
    text: '"Incrivel como acertou tantas coisas sobre minha personalidade!"',
    author: 'Maria S.',
    rating: 5,
  },
  {
    id: 2,
    text: '"O mapa astral mais completo que ja vi. Recomendo!"',
    author: 'Carlos M.',
    rating: 5,
  },
  {
    id: 3,
    text: '"Me ajudou muito a entender meus relacionamentos."',
    author: 'Ana P.',
    rating: 5,
  },
];

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({
  onComplete,
  onQuestionAnswer,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Handle question answer
  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (activeQuestion) {
        onQuestionAnswer(activeQuestion.text, answer);
        setAnsweredQuestions((prev) => new Set(prev).add(activeQuestion.id));
        setActiveQuestion(null);
      }
    },
    [activeQuestion, onQuestionAnswer]
  );

  // Progress through steps
  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }

    const step = STEPS[currentStep];
    const progressInterval = 50; // Update every 50ms
    const progressIncrement = (progressInterval / step.duration) * 100;

    const interval = setInterval(() => {
      setStepProgress((prev) => {
        const newProgress = prev + progressIncrement;

        if (newProgress >= 100) {
          setCompletedSteps((prevCompleted) => new Set(prevCompleted).add(currentStep));
          setCurrentStep((prevStep) => prevStep + 1);
          return 0;
        }

        return newProgress;
      });
    }, progressInterval);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  // Show questions at appropriate times
  useEffect(() => {
    const questionToShow = QUESTIONS.find(
      (q) =>
        q.showAtStep === currentStep &&
        stepProgress >= q.showAtProgress &&
        stepProgress < q.showAtProgress + 20 &&
        !answeredQuestions.has(q.id) &&
        !activeQuestion
    );

    if (questionToShow) {
      setActiveQuestion(questionToShow);
    }
  }, [currentStep, stepProgress, answeredQuestions, activeQuestion]);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (index: number) => {
    if (completedSteps.has(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="analysis-loading" role="region" aria-label="Analise em progresso">
      {/* Background */}
      <div className="analysis-loading-bg" aria-hidden="true">
        <div className="cosmic-gradient" />
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="cosmic-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
        <div className="cosmic-ring cosmic-ring-1" />
        <div className="cosmic-ring cosmic-ring-2" />
      </div>

      {/* Overlay when question is active */}
      {activeQuestion && <div className="analysis-loading-overlay" aria-hidden="true" />}

      <div className={`analysis-loading-content ${activeQuestion ? 'blurred' : ''}`}>
        {/* Animated celestial icon */}
        <div className="analysis-celestial-icon" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="rotating-ring"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              className="rotating-ring-reverse"
            />
            <circle cx="50" cy="50" r="8" fill="url(#gradient3)" className="pulsing-center" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00c8ba" />
                <stop offset="100%" stopColor="#8a2be2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#00c8ba" />
              </linearGradient>
              <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00c8ba" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <h1 className="analysis-title">
          Estamos analisando seus <strong>resultados...</strong>
        </h1>

        {/* Progress Steps */}
        <div className="analysis-steps" role="list" aria-label="Etapas da analise">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div
                key={step.id}
                className={`analysis-step analysis-step-${status}`}
                role="listitem"
                aria-current={status === 'active' ? 'step' : undefined}
              >
                <div className="analysis-step-indicator">
                  {status === 'completed' ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : status === 'active' ? (
                    <div className="step-spinner" />
                  ) : (
                    <div className="step-circle" />
                  )}
                </div>
                <div className="analysis-step-content">
                  <span className="analysis-step-text">{step.text}</span>
                  {status === 'active' && (
                    <span className="analysis-step-percent">
                      {Math.round(stepProgress)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div
          className="analysis-progress-bar"
          role="progressbar"
          aria-valuenow={Math.round(stepProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="analysis-progress-fill"
            style={{ width: `${stepProgress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="analysis-stats">
          <div className="analysis-stat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="analysis-stat-text">
            Mais de <strong>5 milhoes</strong> de mapas astrais realizados
          </span>
        </div>

        {/* Testimonial Carousel */}
        <div className="analysis-testimonials" aria-live="polite">
          <div className="testimonial-container">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-item ${
                  index === currentTestimonial ? 'active' : ''
                }`}
                aria-hidden={index !== currentTestimonial}
              >
                <div className="testimonial-stars" aria-label={`${testimonial.rating} estrelas`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <span className="testimonial-author">{testimonial.author}</span>
              </div>
            ))}
          </div>
          <div className="testimonial-dots" aria-hidden="true">
            {TESTIMONIALS.map((_, index) => (
              <span
                key={index}
                className={`testimonial-dot ${
                  index === currentTestimonial ? 'active' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Popup */}
      {activeQuestion && (
        <div
          className="analysis-question-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="question-title"
        >
          <div className="question-popup-content">
            <div className="question-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 id="question-title" className="question-title">
              {activeQuestion.text}
            </h2>
            <div className="question-buttons">
              <button
                className="question-btn question-btn-yes"
                onClick={() => handleAnswer(true)}
                aria-label="Sim"
              >
                Sim
              </button>
              <button
                className="question-btn question-btn-no"
                onClick={() => handleAnswer(false)}
                aria-label="Nao"
              >
                Nao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisLoading;
