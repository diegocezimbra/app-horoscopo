import { ReactNode } from 'react';
import { AnimatedBackground } from '../../common/AnimatedBackground';
import { ProgressBar } from '../../common/ProgressBar';
import './OnboardingLayout.css';

export interface OnboardingLayoutProps {
  children: ReactNode;
  progress?: number;
  showProgress?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  backgroundVariant?: 'stars' | 'nebula' | 'aurora' | 'cosmic';
  className?: string;
}

export function OnboardingLayout({
  children,
  progress = 0,
  showProgress = true,
  showBackButton = false,
  onBack,
  backgroundVariant = 'cosmic',
  className = '',
}: OnboardingLayoutProps) {
  const classNames = ['onboarding-layout', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <AnimatedBackground variant={backgroundVariant} intensity="medium" />

      <div className="onboarding-layout__container">
        {/* Header with progress */}
        <header className="onboarding-layout__header">
          <div className="onboarding-layout__nav">
            {showBackButton && onBack && (
              <button
                className="onboarding-layout__back-btn"
                onClick={onBack}
                aria-label="Go back"
              >
                <span className="onboarding-layout__back-icon">&larr;</span>
              </button>
            )}
          </div>

          {showProgress && (
            <div className="onboarding-layout__progress">
              <ProgressBar
                progress={progress}
                variant="glow"
                size="sm"
                animated
              />
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="onboarding-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default OnboardingLayout;
