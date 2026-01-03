/**
 * ==============================================================================
 * NameInput Component - User Name Capture
 * ==============================================================================
 *
 * Beautiful input component for capturing user's name with cosmic styling.
 * Features teal focus state and smooth animations.
 *
 * @module components/onboarding/NameInput
 */
import React, { useState, useRef, useEffect } from 'react';
import './NameInput.css';

export interface NameInputProps {
  onContinue: (name: string) => void;
  initialValue?: string;
}

export const NameInput: React.FC<NameInputProps> = ({
  onContinue,
  initialValue = '',
}) => {
  const [name, setName] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = name.trim().length > 0;

  useEffect(() => {
    // Auto-focus input on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue(name.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onContinue(name.trim());
    }
  };

  return (
    <div className="name-input-screen">
      <div className="name-input-content">
        {/* Decorative stars */}
        <div className="name-input-stars" aria-hidden="true">
          <span className="star star-1"></span>
          <span className="star star-2"></span>
          <span className="star star-3"></span>
          <span className="star star-4"></span>
          <span className="star star-5"></span>
        </div>

        <h1 className="name-input-title">Qual e o seu nome?</h1>

        <form onSubmit={handleSubmit} className="name-input-form">
          <div className={`name-input-wrapper ${isFocused ? 'focused' : ''}`}>
            <input
              ref={inputRef}
              type="text"
              className="name-input-field"
              placeholder="Introduza o seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              autoComplete="given-name"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              aria-label="Seu nome"
              aria-describedby="name-hint"
            />
            <div className="name-input-glow" aria-hidden="true"></div>
          </div>
          <span id="name-hint" className="visually-hidden">
            Digite seu nome para continuar
          </span>
        </form>
      </div>

      <button
        className={`name-input-button ${!isValid ? 'disabled' : ''}`}
        onClick={() => isValid && onContinue(name.trim())}
        disabled={!isValid}
        type="button"
        aria-label="Continuar para a proxima etapa"
      >
        Continuar
      </button>
    </div>
  );
};

export default NameInput;
