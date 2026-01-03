/**
 * EnergyMeter Component
 * Displays overall energy level and category ratings
 */

import React from 'react';
import type { DailyEnergy } from '../../../types/dashboard';
import './EnergyMeter.css';

interface EnergyMeterProps {
  energy: DailyEnergy;
}

const StarRating: React.FC<{ stars: number; maxStars?: number }> = ({
  stars,
  maxStars = 5,
}) => {
  return (
    <span className="energy-meter__stars" aria-label={`${stars} de ${maxStars} estrelas`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={`energy-meter__star ${i < stars ? 'energy-meter__star--filled' : ''}`}
          aria-hidden="true"
        >
          {i < stars ? '\u2605' : '\u2606'}
        </span>
      ))}
    </span>
  );
};

export const EnergyMeter: React.FC<EnergyMeterProps> = ({ energy }) => {
  const sentimentLabels = {
    positive: 'Positiva',
    neutral: 'Neutra',
    negative: 'Desafiadora',
  };

  return (
    <div className="energy-meter">
      <div className="energy-meter__header">
        <span className="energy-meter__icon" aria-hidden="true">\uD83D\uDCCA</span>
        <h3 className="energy-meter__title">Sua Energia Hoje</h3>
      </div>

      <div className="energy-meter__overall">
        <div className="energy-meter__bar-container">
          <div
            className="energy-meter__bar"
            style={{ width: `${energy.overall}%` }}
            role="progressbar"
            aria-valuenow={energy.overall}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="energy-meter__bar-glow" />
          </div>
        </div>
        <span className="energy-meter__percentage">
          {energy.overall}% {sentimentLabels[energy.sentiment]}
        </span>
      </div>

      <div className="energy-meter__ratings">
        {energy.ratings.map((rating) => (
          <div key={rating.category} className="energy-meter__rating">
            <span className="energy-meter__rating-icon" aria-hidden="true">
              {rating.icon}
            </span>
            <span className="energy-meter__rating-label">{rating.label}:</span>
            <StarRating stars={rating.stars} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyMeter;
