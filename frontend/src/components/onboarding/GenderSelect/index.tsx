/**
 * ==============================================================================
 * GenderSelect Component - Seleção de Gênero
 * ==============================================================================
 *
 * Tela inicial do onboarding com seleção de gênero em um tema cósmico/místico.
 * Mobile-first, responsivo e animado.
 *
 * @example
 * <GenderSelect onSelect={(gender) => console.log(gender)} />
 *
 * @module components/onboarding
 */
import React, { useState } from 'react';
import './GenderSelect.css';

export type Gender = 'male' | 'female';

export interface GenderSelectProps {
  onSelect: (gender: Gender) => void;
  className?: string;
}

interface GenderCardProps {
  gender: Gender;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const MaleIcon: React.FC = () => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Simple male silhouette */}
    <circle cx="50" cy="25" r="18" fill="currentColor" opacity="0.9" />
    <path
      d="M50 45 C25 45 20 70 20 85 L20 115 C20 118 22 120 25 120 L35 120 L35 90 L40 90 L40 120 L60 120 L60 90 L65 120 L75 120 C78 120 80 118 80 115 L80 85 C80 70 75 45 50 45Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

const FemaleIcon: React.FC = () => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Simple female silhouette with dress */}
    <circle cx="50" cy="25" r="18" fill="currentColor" opacity="0.9" />
    <path
      d="M50 45 C30 45 25 60 25 70 L20 120 L45 120 L45 95 L55 95 L55 120 L80 120 L75 70 C75 60 70 45 50 45Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Hair accent */}
    <ellipse cx="50" cy="20" rx="22" ry="12" fill="currentColor" opacity="0.3" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GenderCard: React.FC<GenderCardProps> = ({ gender, label, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`gender-card ${isSelected ? 'gender-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Selecionar ${label}`}
    >
      <div className="gender-card__icon-wrapper">
        <div className="gender-card__icon">
          {gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
        </div>
        <div className="gender-card__glow" aria-hidden="true" />
      </div>
      <div className="gender-card__content">
        <span className="gender-card__label">{label}</span>
        <span className="gender-card__arrow">
          <ArrowIcon />
        </span>
      </div>
    </button>
  );
};

export const GenderSelect: React.FC<GenderSelectProps> = ({ onSelect, className = '' }) => {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleSelect = (gender: Gender) => {
    setSelectedGender(gender);
    // Small delay for animation feedback before navigation
    setTimeout(() => {
      onSelect(gender);
    }, 300);
  };

  return (
    <div className={`gender-select ${className}`}>
      {/* Animated stars background */}
      <div className="gender-select__stars" aria-hidden="true">
        <div className="star star--1" />
        <div className="star star--2" />
        <div className="star star--3" />
        <div className="star star--4" />
        <div className="star star--5" />
        <div className="star star--6" />
        <div className="star star--7" />
        <div className="star star--8" />
      </div>

      <div className="gender-select__content">
        <header className="gender-select__header">
          <h1 className="gender-select__title">
            Descubra seu Mapa Astral
          </h1>
          <p className="gender-select__subtitle">
            Uma leitura personalizada feita por mais de 5 milhões de pessoas
          </p>
        </header>

        <div className="gender-select__cards" role="group" aria-label="Selecione seu gênero">
          <GenderCard
            gender="male"
            label="Homem"
            isSelected={selectedGender === 'male'}
            onClick={() => handleSelect('male')}
          />
          <GenderCard
            gender="female"
            label="Mulher"
            isSelected={selectedGender === 'female'}
            onClick={() => handleSelect('female')}
          />
        </div>

        <p className="gender-select__privacy">
          Suas informações são privadas e seguras
        </p>
      </div>
    </div>
  );
};

export default GenderSelect;
