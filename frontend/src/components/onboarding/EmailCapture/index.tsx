/**
 * ==============================================================================
 * EmailCapture Component
 * ==============================================================================
 *
 * Critical lead capture screen before paywall.
 * Captures user email to send their horoscope report.
 *
 * Features:
 * - Email validation
 * - Privacy messaging
 * - Animated cosmic background
 * - Loading state for submission
 *
 * @module components/onboarding
 */
import React, { useState } from 'react';
import { Button } from '../../common/Button';
import './EmailCapture.css';

export interface EmailCaptureProps {
  userName?: string;
  onSubmit: (email: string) => void;
  onBack?: () => void;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({
  userName = 'Explorador',
  onSubmit,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onSubmit(email);
  };

  const showError = isTouched && email.length > 0 && !isValid;

  return (
    <div className="email-capture" role="region" aria-label="Captura de email">
      {/* Cosmic Background */}
      <div className="email-capture-bg" aria-hidden="true">
        <div className="cosmic-gradient" />
        <div className="cosmic-glow cosmic-glow-1" />
        <div className="cosmic-glow cosmic-glow-2" />
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="cosmic-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      <div className="email-capture-content">
        {/* Back button */}
        {onBack && (
          <button
            className="email-capture-back"
            onClick={onBack}
            type="button"
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Icon */}
        <div className="email-capture-icon" aria-hidden="true">
          <div className="icon-glow" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="22 6 12 13 2 6" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="email-capture-title">
          Insira seu e-mail para obter seu <strong>relatorio astral</strong>
        </h1>

        {/* Subtitle */}
        <p className="email-capture-subtitle">
          Enviaremos o relatorio completo para o e-mail abaixo, {userName}
        </p>

        {/* Form */}
        <form className="email-capture-form" onSubmit={handleSubmit}>
          <div className={`email-input-wrapper ${showError ? 'error' : ''} ${isValid ? 'valid' : ''}`}>
            <div className="email-input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22 6 12 13 2 6" />
              </svg>
            </div>
            <input
              type="email"
              className="email-input"
              placeholder="seu@email.com"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="email"
              aria-label="Endereço de email"
              aria-invalid={showError}
              aria-describedby={showError ? 'email-error' : undefined}
            />
            {isValid && (
              <div className="email-valid-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>

          {showError && (
            <p id="email-error" className="email-error" role="alert">
              Por favor, insira um email valido
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid}
            loading={isLoading}
          >
            Continuar
          </Button>
        </form>

        {/* Privacy Info */}
        <div className="email-privacy-info">
          <div className="privacy-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="privacy-text">
            Respeitamos a sua privacidade e estamos empenhados em proteger os seus dados pessoais.
            Para sua comodidade, enviar-lhe-emos um e-mail com o acesso ao seu plano.
          </p>
        </div>

        {/* Legal Links */}
        <div className="email-legal-links">
          <a href="/terms" className="legal-link">Termos e condicoes</a>
          <span className="legal-separator">•</span>
          <a href="/privacy" className="legal-link">Politica de privacidade</a>
          <span className="legal-separator">•</span>
          <a href="/subscription" className="legal-link">Politica de assinatura</a>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
