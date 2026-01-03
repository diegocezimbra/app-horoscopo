/**
 * ==============================================================================
 * InterestsSelect Component - User Interests Capture
 * ==============================================================================
 *
 * Two-screen component for capturing user interests and preferences.
 * Features beautiful checkbox styling with cosmic theme.
 *
 * @module components/onboarding/InterestsSelect
 */
import React, { useState } from 'react';
import './InterestsSelect.css';

export type InterestOption =
  | 'mapa_astral'
  | 'comparacao'
  | 'carreiras'
  | 'energia'
  | 'dicas'
  | 'todas';

export type AdditionalAspect =
  | 'procrastinacao'
  | 'personalidade'
  | 'ansiedade'
  | 'trauma'
  | 'arquetipo'
  | 'cerebro'
  | 'inteligencia'
  | 'todas';

export interface InterestsSelectProps {
  screen: 1 | 2;
  onContinue: (selected: string[]) => void;
  initialSelected?: string[];
}

const SCREEN_1_OPTIONS: Array<{ id: InterestOption; label: string }> = [
  { id: 'mapa_astral', label: 'Meu mapa astral geral' },
  { id: 'comparacao', label: 'Como me comparo com os outros' },
  { id: 'carreiras', label: 'Quais carreiras combinam comigo' },
  { id: 'energia', label: 'O que afeta minha energia' },
  { id: 'dicas', label: 'Dicas para melhorar minha vida' },
  { id: 'todas', label: 'Todas as opcoes acima' },
];

const SCREEN_2_OPTIONS: Array<{ id: AdditionalAspect; label: string }> = [
  { id: 'procrastinacao', label: 'Tipo de procrastinacao' },
  { id: 'personalidade', label: 'Tipo de personalidade' },
  { id: 'ansiedade', label: 'Nivel de ansiedade' },
  { id: 'trauma', label: 'Tipo de resposta ao trauma' },
  { id: 'arquetipo', label: 'Arquetipo psicologico' },
  { id: 'cerebro', label: 'Parte do cerebro dominante' },
  { id: 'inteligencia', label: 'Tipo de inteligencia' },
  { id: 'todas', label: 'Todas as opcoes anteriores' },
];

const CheckIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11.6666 3.5L5.24998 9.91667L2.33331 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InterestsSelect: React.FC<InterestsSelectProps> = ({
  screen,
  onContinue,
  initialSelected = [],
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  const options = screen === 1 ? SCREEN_1_OPTIONS : SCREEN_2_OPTIONS;
  const allOptionId = 'todas';
  const otherOptionIds = options.filter((opt) => opt.id !== allOptionId).map((opt) => opt.id);

  const isValid = selected.size > 0;

  const handleToggle = (id: string) => {
    const newSelected = new Set(selected);

    if (id === allOptionId) {
      // Toggle "all options"
      if (selected.has(allOptionId)) {
        // Deselect all
        newSelected.clear();
      } else {
        // Select all
        options.forEach((opt) => newSelected.add(opt.id));
      }
    } else {
      // Toggle individual option
      if (newSelected.has(id)) {
        newSelected.delete(id);
        // Also remove "all" if it was selected
        newSelected.delete(allOptionId);
      } else {
        newSelected.add(id);
        // Check if all individual options are now selected
        const allIndividualSelected = otherOptionIds.every((optId) => newSelected.has(optId));
        if (allIndividualSelected) {
          newSelected.add(allOptionId);
        }
      }
    }

    setSelected(newSelected);
  };

  const handleContinue = () => {
    if (isValid) {
      onContinue(Array.from(selected));
    }
  };

  return (
    <div className="interests-select-screen">
      <div className="interests-select-content">
        {/* Decorative elements */}
        <div className="interests-select-decoration" aria-hidden="true">
          <span className="deco-star deco-star-1"></span>
          <span className="deco-star deco-star-2"></span>
          <span className="deco-orb"></span>
        </div>

        <h1 className="interests-select-title">
          {screen === 1
            ? 'O que mais lhe interessa no seu relatorio astral?'
            : 'Ha outros aspectos que gostaria de descobrir sobre si proprio?'}
        </h1>

        {screen === 1 && (
          <p className="interests-select-subtitle">
            Escolha todas as opcoes que se aplicam
          </p>
        )}

        <div
          className="interests-select-options"
          role="group"
          aria-labelledby="interests-heading"
        >
          <span id="interests-heading" className="visually-hidden">
            Selecione suas areas de interesse
          </span>

          {options.map((option) => {
            const isChecked = selected.has(option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={`interests-option ${isChecked ? 'selected' : ''}`}
                onClick={() => handleToggle(option.id)}
                aria-pressed={isChecked}
              >
                <span className={`interests-checkbox ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <CheckIcon />}
                </span>
                <span className="interests-label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        className={`interests-select-button ${!isValid ? 'disabled' : ''}`}
        onClick={handleContinue}
        disabled={!isValid}
        type="button"
        aria-label="Continuar para a proxima etapa"
      >
        Continuar
      </button>
    </div>
  );
};

export default InterestsSelect;
