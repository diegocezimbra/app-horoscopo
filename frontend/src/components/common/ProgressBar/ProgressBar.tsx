import React from 'react';
import './ProgressBar.css';

export interface ProgressBarProps {
  progress: number;
  variant?: 'default' | 'gradient' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  variant = 'gradient',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const classNames = [
    'cosmic-progress',
    `cosmic-progress--${variant}`,
    `cosmic-progress--${size}`,
    animated && 'cosmic-progress--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {(showLabel || label) && (
        <div className="cosmic-progress__header">
          {label && <span className="cosmic-progress__label">{label}</span>}
          {showLabel && (
            <span className="cosmic-progress__value">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="cosmic-progress__track" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="cosmic-progress__fill"
          style={{ '--progress': `${clampedProgress}%` } as React.CSSProperties}
        />
        <div className="cosmic-progress__shimmer" />
      </div>
    </div>
  );
}

export default ProgressBar;
