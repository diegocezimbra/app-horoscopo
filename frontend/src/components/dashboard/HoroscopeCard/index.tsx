/**
 * HoroscopeCard Component
 * Daily horoscope with sun sign, preview, and expandable full text
 */

import React from 'react';
import type { DailyHoroscope } from '../../../types/dashboard';
import './HoroscopeCard.css';

interface HoroscopeCardProps {
  horoscope: DailyHoroscope;
  isExpanded: boolean;
  onToggle: () => void;
}

export const HoroscopeCard: React.FC<HoroscopeCardProps> = ({
  horoscope,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="horoscope-card">
      <div className="horoscope-card__header">
        <span className="horoscope-card__label">SEU HOROSCOPO DIARIO</span>
      </div>

      <div className="horoscope-card__sign">
        <span className="horoscope-card__symbol" aria-hidden="true">
          {horoscope.symbol}
        </span>
        <span className="horoscope-card__sign-name">{horoscope.signName}</span>
      </div>

      <h3 className="horoscope-card__title">{horoscope.title}</h3>

      <div className="horoscope-card__content">
        <p className="horoscope-card__text">
          {isExpanded ? horoscope.fullText : `"${horoscope.preview}"`}
        </p>
      </div>

      <button
        className="horoscope-card__toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Ler menos' : 'Ler mais'}</span>
        <svg
          className={`horoscope-card__toggle-icon ${isExpanded ? 'horoscope-card__toggle-icon--expanded' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Decorative stars */}
      <div className="horoscope-card__stars" aria-hidden="true">
        <span className="horoscope-card__star horoscope-card__star--1">\u2728</span>
        <span className="horoscope-card__star horoscope-card__star--2">\u2B50</span>
        <span className="horoscope-card__star horoscope-card__star--3">\u2728</span>
      </div>
    </div>
  );
};

export default HoroscopeCard;
