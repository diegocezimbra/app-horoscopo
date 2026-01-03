/**
 * ==============================================================================
 * FeaturesShowcase Component - Features Grid Display
 * ==============================================================================
 *
 * Displays a beautiful grid of app features with cosmic-themed icons.
 * Shows users what they'll discover about themselves.
 *
 * @module components/onboarding/FeaturesShowcase
 */
import React from 'react';
import './FeaturesShowcase.css';

export interface FeaturesShowcaseProps {
  onContinue: () => void;
}

interface Feature {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// SVG Icons as React components
const StarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 18.27L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"
      fill="currentColor"
    />
  </svg>
);

const BrainIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C13.5 2 14.8 2.5 15.8 3.3C16.9 2.8 18.2 2.6 19.5 3C21.5 3.6 23 5.5 23 7.7C23 9.1 22.4 10.4 21.5 11.3C22.4 12.6 22.5 14.3 21.6 15.7C21 16.7 20 17.4 18.8 17.7C18.9 18.1 19 18.5 19 19C19 21.2 17.2 23 15 23C14.2 23 13.5 22.7 12.9 22.3C12.3 22.7 11.6 23 10.8 23C8.6 23 6.8 21.2 6.8 19C6.8 18.5 6.9 18.1 7 17.7C5.8 17.4 4.8 16.7 4.2 15.7C3.3 14.3 3.4 12.6 4.3 11.3C3.4 10.4 2.8 9.1 2.8 7.7C2.8 5.5 4.3 3.6 6.3 3C7.6 2.6 8.9 2.8 10 3.3C11 2.5 12.3 2 13.8 2H12Z"
      fill="currentColor"
    />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      fill="currentColor"
    />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
      fill="currentColor"
    />
  </svg>
);

const HeadIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 14.85 3.21 17.4 5.13 19.15C5.57 19.54 6.21 19.37 6.5 18.85L7.29 17.5C7.5 17.14 7.5 16.7 7.28 16.35C6.47 15.02 6 13.56 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 13.56 17.53 15.02 16.72 16.35C16.5 16.7 16.5 17.14 16.71 17.5L17.5 18.85C17.79 19.37 18.43 19.54 18.87 19.15C20.79 17.4 22 14.85 22 12C22 6.48 17.52 2 12 2Z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const LightbulbIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2Z"
      fill="currentColor"
    />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M12 6V12L16 14"
      stroke="#0F0A1A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BrainSidesIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2V22"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 7C4 5 5.5 3 8 3C9.5 3 10.5 3.5 11 4V20C10.5 20.5 9.5 21 8 21C5.5 21 4 19 4 17C4 15.5 5 14 6 13.5C5 13 4 11.5 4 10C4 8.5 5 7 6 6.5C5 6 4 8 4 7Z"
      fill="currentColor"
    />
    <path
      d="M20 7C20 5 18.5 3 16 3C14.5 3 13.5 3.5 13 4V20C13.5 20.5 14.5 21 16 21C18.5 21 20 19 20 17C20 15.5 19 14 18 13.5C19 13 20 11.5 20 10C20 8.5 19 7 18 6.5C19 6 20 8 20 7Z"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

const FireIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C16.4183 22 20 18.4183 20 14C20 10 17 7 16 6C16 8 14 10 12 10C10 10 9 8 9 6C9 4 11 2 12 2C8 2 4 6 4 12C4 16 6.5 22 12 22Z"
      fill="currentColor"
    />
    <path
      d="M12 22C14.2091 22 16 20.2091 16 18C16 16 14.5 14 13.5 13C13.5 14.5 12.5 15.5 12 15.5C11.5 15.5 10.5 14.5 10.5 13C9.5 14 8 16 8 18C8 20.2091 9.79086 22 12 22Z"
      fill="#FFD700"
    />
  </svg>
);

const GraphIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3V21H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 14L11 10L15 14L21 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="14" r="2" fill="currentColor" />
    <circle cx="11" cy="10" r="2" fill="currentColor" />
    <circle cx="15" cy="14" r="2" fill="currentColor" />
    <circle cx="21" cy="8" r="2" fill="currentColor" />
  </svg>
);

const BatteryIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="18" height="10" rx="2" fill="currentColor" />
    <rect x="22" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
    <rect x="4" y="9" width="6" height="6" rx="1" fill="#0F0A1A" opacity="0.8" />
  </svg>
);

const FEATURES: Feature[] = [
  { id: 'pontuacao', label: 'Pontuacao astral', icon: <StarIcon /> },
  { id: 'emocional', label: 'Tipo de inteligencia emocional', icon: <BrainIcon /> },
  { id: 'trauma', label: 'Tipo de trauma', icon: <ShieldIcon /> },
  { id: 'arquetipo', label: 'Arquetipo', icon: <HeartIcon /> },
  { id: 'personalidade', label: 'Tipo de personalidade', icon: <HeadIcon /> },
  { id: 'inteligencia', label: 'Tipo de inteligencia', icon: <LightbulbIcon /> },
  { id: 'procrastinacao', label: 'Tipo de procrastinacao', icon: <ClockIcon /> },
  { id: 'cerebro', label: 'Parte dominante do cerebro', icon: <BrainSidesIcon /> },
  { id: 'ansiedade', label: 'Nivel de ansiedade', icon: <FireIcon /> },
  { id: 'stress', label: 'Nivel de stress', icon: <GraphIcon /> },
  { id: 'esgotamento', label: 'Nivel de esgotamento', icon: <BatteryIcon /> },
];

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ onContinue }) => {
  return (
    <div className="features-showcase-screen">
      {/* Background decoration */}
      <div className="features-bg-decoration" aria-hidden="true">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-star bg-star-1"></div>
        <div className="bg-star bg-star-2"></div>
        <div className="bg-star bg-star-3"></div>
      </div>

      <div className="features-showcase-content">
        <h1 className="features-showcase-title">
          O Astral e muito mais do que apenas um mapa
        </h1>
        <p className="features-showcase-subtitle">
          Ajudaremos voce a descobrir quem voce realmente e
        </p>

        <div className="features-grid" role="list">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-item"
              role="listitem"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <span className="feature-label">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="features-showcase-button"
        onClick={onContinue}
        type="button"
        aria-label="Continuar para a proxima etapa"
      >
        Continuar
      </button>
    </div>
  );
};

export default FeaturesShowcase;
