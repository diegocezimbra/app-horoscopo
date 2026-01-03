/**
 * ==============================================================================
 * Button Component - Cosmic Theme
 * ==============================================================================
 *
 * Reusable button with cosmic styling for the horoscope app.
 *
 * ## Variants
 *
 * | Variant   | Uso                                        |
 * |-----------|--------------------------------------------|
 * | primary   | Main CTA (teal cosmic gradient)            |
 * | secondary | Outlined alternative actions               |
 * | ghost     | Minimal styling                            |
 *
 * ## Features
 * - Full width option
 * - Loading state with spinner
 * - Disabled state
 * - Smooth cosmic animations
 *
 * @module components/common
 */
import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const classes = [
      'cosmic-btn',
      `cosmic-btn-${variant}`,
      `cosmic-btn-${size}`,
      fullWidth && 'cosmic-btn-full',
      loading && 'cosmic-btn-loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="cosmic-btn-spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          </span>
        )}
        {!loading && leftIcon && (
          <span className="cosmic-btn-icon cosmic-btn-icon-left">{leftIcon}</span>
        )}
        <span className="cosmic-btn-text">{children}</span>
        {!loading && rightIcon && (
          <span className="cosmic-btn-icon cosmic-btn-icon-right">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
