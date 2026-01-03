/**
 * ==============================================================================
 * CelebrityComparison Component
 * ==============================================================================
 *
 * The BIG reveal teaser that compares the user with famous celebrities.
 * Creates excitement and curiosity about their astrological profile.
 *
 * Features:
 * - Three cards side by side (celebrity, user silhouette, celebrity)
 * - Zodiac trait badges
 * - Smooth reveal animations
 * - Personalized title with user's name
 *
 * @module components/onboarding
 */
import React from 'react';
import { Button } from '../../common/Button';
import './CelebrityComparison.css';

export interface CelebrityComparisonProps {
  userName: string;
  onContinue: () => void;
}

interface Celebrity {
  name: string;
  image: string;
  sign: string;
  trait: string;
}

const CELEBRITIES: [Celebrity, Celebrity] = [
  {
    name: 'Beyonce',
    image: '/images/celebrities/beyonce.jpg',
    sign: 'Virgem',
    trait: 'Perfeccionista',
  },
  {
    name: 'Einstein',
    image: '/images/celebrities/einstein.jpg',
    sign: 'Peixes',
    trait: 'Visionario',
  },
];

export const CelebrityComparison: React.FC<CelebrityComparisonProps> = ({
  userName,
  onContinue,
}) => {
  return (
    <div className="celebrity-comparison" role="region" aria-label="Comparacao com celebridades">
      {/* Background */}
      <div className="celebrity-comparison-bg" aria-hidden="true">
        <div className="cosmic-gradient-overlay" />
        {[...Array(50)].map((_, i) => (
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
        <div className="cosmic-glow cosmic-glow-left" />
        <div className="cosmic-glow cosmic-glow-right" />
      </div>

      <div className="celebrity-comparison-content">
        {/* Comparison Cards */}
        <div className="comparison-cards" role="list">
          {/* Left Celebrity */}
          <div className="comparison-card comparison-card-celebrity" role="listitem">
            <div className="card-image-container">
              <div className="card-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              </div>
              <div className="card-zodiac-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <h3 className="card-name">{CELEBRITIES[0].name}</h3>
            <span className="card-sign">{CELEBRITIES[0].sign}</span>
            <div className="card-trait-badge">{CELEBRITIES[0].trait}</div>
          </div>

          {/* Center - User */}
          <div className="comparison-card comparison-card-user" role="listitem">
            <div className="card-image-container user-container">
              <div className="user-silhouette">
                <svg viewBox="0 0 80 80" fill="none">
                  <defs>
                    <linearGradient id="silhouetteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00c8ba" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="28" r="16" fill="url(#silhouetteGrad)" />
                  <path
                    d="M10 72c0-16.569 13.431-30 30-30s30 13.431 30 30"
                    fill="url(#silhouetteGrad)"
                  />
                </svg>
                <span className="user-mystery">??</span>
              </div>
              <div className="card-zodiac-badge user-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <h3 className="card-name user-name">Voce</h3>
            <span className="card-sign user-sign">Seu Signo</span>
            <div className="card-trait-badge user-trait">Descobrir</div>
            <div className="user-glow" aria-hidden="true" />
          </div>

          {/* Right Celebrity */}
          <div className="comparison-card comparison-card-celebrity" role="listitem">
            <div className="card-image-container">
              <div className="card-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              </div>
              <div className="card-zodiac-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <h3 className="card-name">{CELEBRITIES[1].name}</h3>
            <span className="card-sign">{CELEBRITIES[1].sign}</span>
            <div className="card-trait-badge">{CELEBRITIES[1].trait}</div>
          </div>
        </div>

        {/* Title Section */}
        <div className="comparison-title-section">
          <h1 className="comparison-title">
            <strong>{userName}</strong>, o resultado do seu mapa astral esta pronto!
          </h1>
          <p className="comparison-subtitle">
            Curioso para saber como se compara aos mais influentes? Vamos descobrir!
          </p>
        </div>

        {/* Action Button */}
        <div className="comparison-action">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onContinue}
            aria-label="Continuar para ver seu mapa astral"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CelebrityComparison;
