import React from 'react';
import './Header.css';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showLogo = true,
  rightContent,
  transparent = false,
  className = '',
}: HeaderProps) {
  const classNames = [
    'cosmic-header',
    transparent && 'cosmic-header--transparent',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classNames}>
      <div className="cosmic-header__container">
        <div className="cosmic-header__left">
          {showLogo && (
            <div className="cosmic-header__logo">
              <span className="cosmic-header__logo-icon">{'\u2728'}</span>
              <span className="cosmic-header__logo-text">Astral</span>
            </div>
          )}
          {title && (
            <div className="cosmic-header__titles">
              <h1 className="cosmic-header__title">{title}</h1>
              {subtitle && (
                <p className="cosmic-header__subtitle">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {rightContent && (
          <div className="cosmic-header__right">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
