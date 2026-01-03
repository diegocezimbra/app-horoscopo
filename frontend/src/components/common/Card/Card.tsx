import { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  selected?: boolean;
  glow?: boolean;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  selected = false,
  glow = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    'cosmic-card',
    `cosmic-card--${variant}`,
    `cosmic-card--padding-${padding}`,
    hoverable && 'cosmic-card--hoverable',
    selected && 'cosmic-card--selected',
    glow && 'cosmic-card--glow',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

export default Card;
