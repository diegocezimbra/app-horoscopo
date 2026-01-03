import React, { useMemo } from 'react';
import './AnimatedBackground.css';

export interface AnimatedBackgroundProps {
  variant?: 'stars' | 'nebula' | 'aurora' | 'cosmic';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export function AnimatedBackground({
  variant = 'cosmic',
  intensity = 'medium',
  className = '',
}: AnimatedBackgroundProps) {
  const starCount = useMemo(() => {
    switch (intensity) {
      case 'low':
        return 30;
      case 'medium':
        return 60;
      case 'high':
        return 100;
      default:
        return 60;
    }
  }, [intensity]);

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, [starCount]);

  const classNames = [
    'cosmic-bg',
    `cosmic-bg--${variant}`,
    `cosmic-bg--${intensity}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} aria-hidden="true">
      {/* Base gradient */}
      <div className="cosmic-bg__gradient" />

      {/* Stars layer */}
      {(variant === 'stars' || variant === 'cosmic') && (
        <div className="cosmic-bg__stars">
          {stars.map((star) => (
            <div
              key={star.id}
              className="cosmic-bg__star"
              style={{
                '--star-size': `${star.size}px`,
                '--star-x': `${star.x}%`,
                '--star-y': `${star.y}%`,
                '--star-duration': `${star.duration}s`,
                '--star-delay': `${star.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Nebula layer */}
      {(variant === 'nebula' || variant === 'cosmic') && (
        <div className="cosmic-bg__nebula">
          <div className="cosmic-bg__nebula-orb cosmic-bg__nebula-orb--1" />
          <div className="cosmic-bg__nebula-orb cosmic-bg__nebula-orb--2" />
          <div className="cosmic-bg__nebula-orb cosmic-bg__nebula-orb--3" />
        </div>
      )}

      {/* Aurora layer */}
      {(variant === 'aurora' || variant === 'cosmic') && (
        <div className="cosmic-bg__aurora">
          <div className="cosmic-bg__aurora-wave cosmic-bg__aurora-wave--1" />
          <div className="cosmic-bg__aurora-wave cosmic-bg__aurora-wave--2" />
        </div>
      )}

      {/* Shooting star (occasional) */}
      {variant === 'cosmic' && (
        <div className="cosmic-bg__shooting-stars">
          <div className="cosmic-bg__shooting-star cosmic-bg__shooting-star--1" />
          <div className="cosmic-bg__shooting-star cosmic-bg__shooting-star--2" />
        </div>
      )}
    </div>
  );
}

export default AnimatedBackground;
