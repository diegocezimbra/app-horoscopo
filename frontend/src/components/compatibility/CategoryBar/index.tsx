/**
 * CategoryBar Component
 * Progress bar for compatibility categories
 */

import React, { useEffect, useState } from 'react';
import './CategoryBar.css';

export interface CategoryBarProps {
  icon: string;
  label: string;
  score: number;
  description?: string;
  animated?: boolean;
  delay?: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  icon,
  label,
  score,
  description,
  animated = true,
  delay = 0,
}) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setIsVisible(true);
      return;
    }

    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const animationTimer = setTimeout(() => {
      const duration = 800;
      const steps = 30;
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
    }, delay + 100);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [score, animated, delay]);

  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'var(--color-success)';
    if (value >= 60) return 'var(--color-accent)';
    if (value >= 40) return '#F97316';
    return 'var(--color-error)';
  };

  const color = getScoreColor(score);

  return (
    <div
      className={`category-bar ${isVisible ? 'category-bar--visible' : ''}`}
      style={{ '--animation-delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="category-bar__header">
        <div className="category-bar__label-group">
          <span className="category-bar__icon">{icon}</span>
          <span className="category-bar__label">{label}</span>
        </div>
        <span className="category-bar__score" style={{ color }}>
          {displayScore}%
        </span>
      </div>

      <div className="category-bar__track">
        <div
          className="category-bar__fill"
          style={{
            width: `${displayScore}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>

      {description && (
        <p className="category-bar__description">{description}</p>
      )}
    </div>
  );
};

export default CategoryBar;
