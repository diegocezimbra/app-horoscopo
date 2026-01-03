/**
 * CompatibilityMeter Component
 * Animated circular progress showing compatibility score
 */

import React, { useEffect, useState } from 'react';
import './CompatibilityMeter.css';

export interface CompatibilityMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

export const CompatibilityMeter: React.FC<CompatibilityMeterProps> = ({
  score,
  size = 'md',
  animated = true,
  showLabel = true,
  label = 'Compatibilidade Geral',
}) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(score, Math.round(increment * step));
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const getScoreColor = (value: number): string => {
    if (value >= 80) return '#10B981'; // Green
    if (value >= 60) return '#F59E0B'; // Yellow/Gold
    if (value >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 90) return 'Almas Gemeas!';
    if (value >= 80) return 'Excelente!';
    if (value >= 70) return 'Muito Bom';
    if (value >= 60) return 'Bom';
    if (value >= 50) return 'Moderado';
    if (value >= 40) return 'Desafiador';
    return 'Dificil';
  };

  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: 24 },
    md: { width: 180, strokeWidth: 12, fontSize: 36 },
    lg: { width: 240, strokeWidth: 16, fontSize: 48 },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const offset = circumference - progress;
  const color = getScoreColor(displayScore);

  return (
    <div className={`compatibility-meter compatibility-meter--${size}`}>
      <div className="compatibility-meter__circle-container" style={{ width, height: width }}>
        <svg
          className="compatibility-meter__svg"
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
        >
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            className="compatibility-meter__bg"
            cx={width / 2}
            cy={width / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <circle
            className="compatibility-meter__progress"
            cx={width / 2}
            cy={width / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter="url(#glow)"
            transform={`rotate(-90 ${width / 2} ${width / 2})`}
          />
        </svg>

        <div className="compatibility-meter__content">
          <span
            className="compatibility-meter__score"
            style={{ fontSize, color }}
          >
            {displayScore}%
          </span>
          <span className="compatibility-meter__rating" style={{ color }}>
            {getScoreLabel(displayScore)}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="compatibility-meter__label">
          {label}
        </div>
      )}
    </div>
  );
};

export default CompatibilityMeter;
