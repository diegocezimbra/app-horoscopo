/**
 * ==============================================================================
 * QuizQuestion Component - Pergunta do Quiz
 * ==============================================================================
 *
 * Componente reutilizavel para perguntas do quiz com suporte a:
 * - Grid de imagens ou lista de texto como respostas
 * - Barra de progresso
 * - Timer opcional
 * - Transicoes suaves entre perguntas
 *
 * @example
 * <QuizQuestion
 *   questionNumber={1}
 *   totalQuestions={12}
 *   question="Qual imagem mais representa voce?"
 *   answers={[
 *     { id: 'a', label: 'Opcao A', image: '/img/a.jpg' },
 *     { id: 'b', label: 'Opcao B', image: '/img/b.jpg' },
 *   ]}
 *   answerType="image-grid"
 *   onAnswer={(id) => console.log(id)}
 *   onBack={() => console.log('back')}
 * />
 *
 * @module components/onboarding
 */
import React, { useState, useEffect, useCallback } from 'react';
import './QuizQuestion.css';

export interface Answer {
  id: string;
  label: string;
  image?: string;
}

export interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  questionImage?: string;
  answers: Answer[];
  answerType: 'image-grid' | 'text-list';
  onAnswer: (answerId: string) => void;
  onBack: () => void;
  timer?: number; // Optional timer in seconds
  className?: string;
}

const BackIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="quiz-progress" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className="quiz-progress__bar">
        <div
          className="quiz-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="quiz-progress__text">
        {current} de {total}
      </span>
    </div>
  );
};

interface TimerDisplayProps {
  seconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="quiz-timer" aria-label={`Tempo restante: ${minutes} minutos e ${remainingSeconds} segundos`}>
      <ClockIcon />
      <span>
        {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

interface ImageAnswerProps {
  answer: Answer;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const ImageAnswer: React.FC<ImageAnswerProps> = ({ answer, isSelected, onClick, index }) => (
  <button
    type="button"
    className={`quiz-answer quiz-answer--image ${isSelected ? 'quiz-answer--selected' : ''}`}
    onClick={onClick}
    aria-pressed={isSelected}
    aria-label={answer.label}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="quiz-answer__image-wrapper">
      {answer.image ? (
        <img
          src={answer.image}
          alt={answer.label}
          className="quiz-answer__image"
          loading="lazy"
        />
      ) : (
        <div className="quiz-answer__image-placeholder">
          <span>{answer.label.charAt(0)}</span>
        </div>
      )}
      <div className="quiz-answer__overlay" />
    </div>
    <span className="quiz-answer__label">{answer.label}</span>
  </button>
);

interface TextAnswerProps {
  answer: Answer;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const TextAnswer: React.FC<TextAnswerProps> = ({ answer, isSelected, onClick, index }) => (
  <button
    type="button"
    className={`quiz-answer quiz-answer--text ${isSelected ? 'quiz-answer--selected' : ''}`}
    onClick={onClick}
    aria-pressed={isSelected}
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    <span className="quiz-answer__text">{answer.label}</span>
    <div className="quiz-answer__indicator" />
  </button>
);

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionNumber,
  totalQuestions,
  question,
  questionImage,
  answers,
  answerType,
  onAnswer,
  onBack,
  timer,
  className = '',
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timer || 0);
  const [isVisible, setIsVisible] = useState(true);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsTransitioning(false);
    setIsVisible(false);
    // Trigger entrance animation
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [questionNumber]);

  // Timer countdown
  useEffect(() => {
    if (!timer) return;
    setTimeRemaining(timer);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, questionNumber]);

  const handleAnswerClick = useCallback((answerId: string) => {
    if (isTransitioning) return;

    setSelectedAnswer(answerId);
    setIsTransitioning(true);

    // Small delay for visual feedback before transitioning
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onAnswer(answerId);
      }, 300);
    }, 200);
  }, [isTransitioning, onAnswer]);

  const handleBack = useCallback(() => {
    if (isTransitioning) return;
    setIsVisible(false);
    setTimeout(() => {
      onBack();
    }, 200);
  }, [isTransitioning, onBack]);

  return (
    <div className={`quiz-question ${isVisible ? 'quiz-question--visible' : ''} ${className}`}>
      {/* Background */}
      <div className="quiz-question__bg" aria-hidden="true">
        <div className="quiz-question__orb quiz-question__orb--1" />
        <div className="quiz-question__orb quiz-question__orb--2" />
      </div>

      <div className="quiz-question__content">
        {/* Header */}
        <header className="quiz-question__header">
          <button
            type="button"
            className="quiz-question__back"
            onClick={handleBack}
            aria-label="Voltar para pergunta anterior"
            disabled={questionNumber === 1 || isTransitioning}
          >
            <BackIcon />
          </button>

          {timer && <TimerDisplay seconds={timeRemaining} />}

          <ProgressBar current={questionNumber} total={totalQuestions} />
        </header>

        {/* Question */}
        <div className="quiz-question__body">
          {questionImage && (
            <div className="quiz-question__image-wrapper">
              <img
                src={questionImage}
                alt=""
                className="quiz-question__image"
              />
            </div>
          )}

          <h1 className="quiz-question__title">{question}</h1>
        </div>

        {/* Answers */}
        <div
          className={`quiz-answers ${answerType === 'image-grid' ? 'quiz-answers--grid' : 'quiz-answers--list'}`}
          role="group"
          aria-label="Opcoes de resposta"
        >
          {answers.map((answer, index) =>
            answerType === 'image-grid' ? (
              <ImageAnswer
                key={answer.id}
                answer={answer}
                isSelected={selectedAnswer === answer.id}
                onClick={() => handleAnswerClick(answer.id)}
                index={index}
              />
            ) : (
              <TextAnswer
                key={answer.id}
                answer={answer}
                isSelected={selectedAnswer === answer.id}
                onClick={() => handleAnswerClick(answer.id)}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
