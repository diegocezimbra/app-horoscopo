/**
 * ==============================================================================
 * PositiveFeedback Component - Motivational Feedback
 * ==============================================================================
 *
 * Displays positive reinforcement during the quiz to motivate users.
 * Two variants: ranking (podium) and celebration (confetti).
 *
 * @module components/onboarding/PositiveFeedback
 */
import React from 'react';
import './PositiveFeedback.css';

export interface PositiveFeedbackProps {
  variant: 'ranking' | 'celebration';
  percentage: number;
  questionsRemaining?: number;
  onContinue: () => void;
}

const PodiumIllustration: React.FC = () => (
  <svg
    className="positive-feedback-illustration"
    viewBox="0 0 200 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Stars in background */}
    <circle cx="30" cy="30" r="2" fill="#5EEAD4" className="star star-1" />
    <circle cx="170" cy="40" r="1.5" fill="#5EEAD4" className="star star-2" />
    <circle cx="50" cy="60" r="1" fill="#A78BFA" className="star star-3" />
    <circle cx="160" cy="20" r="2" fill="#A78BFA" className="star star-4" />
    <circle cx="20" cy="80" r="1.5" fill="#5EEAD4" className="star star-5" />
    <circle cx="180" cy="70" r="1" fill="#5EEAD4" className="star star-6" />

    {/* Podium */}
    <rect x="70" y="130" width="60" height="50" rx="4" fill="url(#podiumGradient)" />
    <rect x="30" y="145" width="50" height="35" rx="4" fill="url(#podiumSecondary)" />
    <rect x="120" y="155" width="50" height="25" rx="4" fill="url(#podiumThird)" />

    {/* First place number */}
    <text x="100" y="160" textAnchor="middle" fill="#0F172A" fontSize="20" fontWeight="bold">1</text>
    <text x="55" y="170" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="bold">2</text>
    <text x="145" y="175" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="bold">3</text>

    {/* Person on podium */}
    <circle cx="100" cy="95" r="18" fill="url(#personGradient)" />
    <ellipse cx="100" cy="120" rx="15" ry="10" fill="url(#personGradient)" />

    {/* Trophy/star above */}
    <path d="M100 55 L103 65 L113 65 L105 72 L108 82 L100 76 L92 82 L95 72 L87 65 L97 65 Z" fill="#FFD700" className="trophy-star" />

    {/* Raised arms */}
    <path d="M85 110 Q75 95 70 85" stroke="url(#personGradient)" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M115 110 Q125 95 130 85" stroke="url(#personGradient)" strokeWidth="6" strokeLinecap="round" fill="none" />

    <defs>
      <linearGradient id="podiumGradient" x1="70" y1="130" x2="130" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5EEAD4" />
        <stop offset="1" stopColor="#14B8A6" />
      </linearGradient>
      <linearGradient id="podiumSecondary" x1="30" y1="145" x2="80" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="podiumThird" x1="120" y1="155" x2="170" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="personGradient" x1="82" y1="85" x2="118" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
  </svg>
);

const CelebrationIllustration: React.FC = () => (
  <svg
    className="positive-feedback-illustration celebration"
    viewBox="0 0 200 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Confetti particles */}
    <rect x="25" y="40" width="8" height="8" rx="1" fill="#5EEAD4" className="confetti confetti-1" transform="rotate(15 29 44)" />
    <rect x="45" y="25" width="6" height="6" rx="1" fill="#F472B6" className="confetti confetti-2" transform="rotate(-20 48 28)" />
    <rect x="155" y="30" width="7" height="7" rx="1" fill="#A78BFA" className="confetti confetti-3" transform="rotate(30 158.5 33.5)" />
    <rect x="170" y="55" width="5" height="5" rx="1" fill="#FFD700" className="confetti confetti-4" transform="rotate(-10 172.5 57.5)" />
    <rect x="30" y="70" width="6" height="6" rx="1" fill="#FFD700" className="confetti confetti-5" transform="rotate(45 33 73)" />
    <rect x="165" y="85" width="8" height="8" rx="1" fill="#5EEAD4" className="confetti confetti-6" transform="rotate(-30 169 89)" />

    {/* More confetti */}
    <circle cx="60" cy="50" r="4" fill="#F472B6" className="confetti confetti-7" />
    <circle cx="140" cy="45" r="3" fill="#5EEAD4" className="confetti confetti-8" />
    <circle cx="35" cy="95" r="3" fill="#A78BFA" className="confetti confetti-9" />
    <circle cx="175" cy="40" r="2.5" fill="#F472B6" className="confetti confetti-10" />

    {/* Person celebrating */}
    <circle cx="100" cy="100" r="22" fill="url(#celebPersonGradient)" />
    <ellipse cx="100" cy="145" rx="18" ry="25" fill="url(#celebBodyGradient)" />

    {/* Happy face */}
    <circle cx="93" cy="97" r="2.5" fill="#0F172A" />
    <circle cx="107" cy="97" r="2.5" fill="#0F172A" />
    <path d="M90 106 Q100 116 110 106" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Raised arms in celebration */}
    <path d="M82 135 Q65 115 55 90" stroke="url(#celebBodyGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M118 135 Q135 115 145 90" stroke="url(#celebBodyGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />

    {/* Stars around */}
    <path d="M50 85 L52 90 L57 90 L53 94 L55 99 L50 96 L45 99 L47 94 L43 90 L48 90 Z" fill="#FFD700" className="star star-1" />
    <path d="M150 85 L152 90 L157 90 L153 94 L155 99 L150 96 L145 99 L147 94 L143 90 L148 90 Z" fill="#FFD700" className="star star-2" />
    <path d="M100 50 L103 58 L111 58 L105 63 L107 71 L100 66 L93 71 L95 63 L89 58 L97 58 Z" fill="#5EEAD4" className="star star-3" />

    <defs>
      <linearGradient id="celebPersonGradient" x1="78" y1="78" x2="122" y2="122" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#FCD34D" />
      </linearGradient>
      <linearGradient id="celebBodyGradient" x1="82" y1="120" x2="118" y2="170" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
  </svg>
);

export const PositiveFeedback: React.FC<PositiveFeedbackProps> = ({
  variant,
  percentage,
  questionsRemaining,
  onContinue,
}) => {
  const complementPercentage = 100 - percentage;

  return (
    <div className="positive-feedback">
      <div className="positive-feedback-content">
        {variant === 'ranking' ? (
          <>
            <PodiumIllustration />
            <h2 className="positive-feedback-title">
              Esta entre os primeiros <span className="highlight">{percentage}%</span>!
            </h2>
            <p className="positive-feedback-subtitle">
              A sua energia cosmica e superior a {complementPercentage}% de todos os participantes! Continua!
            </p>
          </>
        ) : (
          <>
            <CelebrationIllustration />
            <h2 className="positive-feedback-title">
              Apenas <span className="highlight">{percentage}%</span> dos participantes responderam corretamente a esta pergunta
            </h2>
            <p className="positive-feedback-subtitle">
              Ja provou que nao e uma pessoa comum.{' '}
              {questionsRemaining !== undefined && `Faltam apenas ${questionsRemaining} perguntas!`}
            </p>
          </>
        )}
      </div>

      <button
        className="positive-feedback-button"
        onClick={onContinue}
        type="button"
        aria-label="Continuar para a proxima etapa"
      >
        Continuar
      </button>
    </div>
  );
};

export default PositiveFeedback;
