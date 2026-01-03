/**
 * ==============================================================================
 * CredibilityBadges Component
 * ==============================================================================
 *
 * Displays prestigious source badges to build trust and credibility.
 * Shows that the astrology analysis is based on established principles.
 *
 * @module components/onboarding
 */
import React from 'react';
import { Button } from '../../common/Button';
import './CredibilityBadges.css';

export interface CredibilityBadgesProps {
  onContinue: () => void;
}

export const CredibilityBadges: React.FC<CredibilityBadgesProps> = ({
  onContinue,
}) => {
  const badges = [
    {
      id: 'jung',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      text: 'BASEADO EM ESTUDOS DE',
      highlight: 'CARL JUNG',
    },
    {
      id: 'vedic',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      text: 'PRINCIPIOS DA',
      highlight: 'ASTROLOGIA VEDICA',
    },
    {
      id: 'hermetic',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="4" />
          <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
        </svg>
      ),
      text: 'TRADICOES',
      highlight: 'HERMETICAS',
    },
  ];

  return (
    <div className="credibility-badges" role="region" aria-label="Credibilidade">
      {/* Background cosmic elements */}
      <div className="credibility-badges-bg" aria-hidden="true">
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
        {[...Array(30)].map((_, i) => (
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
      </div>

      <div className="credibility-badges-content">
        {/* Scientific icon */}
        <div className="credibility-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="32" cy="32" r="28" />
            <circle cx="32" cy="32" r="20" strokeDasharray="4 4" />
            <circle cx="32" cy="32" r="12" />
            <circle cx="32" cy="32" r="4" fill="currentColor" />
            <line x1="32" y1="4" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="60" />
            <line x1="4" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="60" y2="32" />
          </svg>
        </div>

        <h1 className="credibility-title">
          O Astral foi desenvolvido utilizando principios da ciencia astrologica
        </h1>

        <p className="credibility-subtitle">
          Inspirado pela investigacao em astrologia e astronomia
        </p>

        <div className="credibility-badges-grid" role="list">
          {badges.map((badge) => (
            <div key={badge.id} className="credibility-badge" role="listitem">
              <div className="credibility-badge-icon" aria-hidden="true">
                {badge.icon}
              </div>
              <div className="credibility-badge-text">
                <span className="credibility-badge-label">{badge.text}</span>
                <strong className="credibility-badge-highlight">{badge.highlight}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="credibility-action">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onContinue}
            aria-label="Continuar para a proxima etapa"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CredibilityBadges;
