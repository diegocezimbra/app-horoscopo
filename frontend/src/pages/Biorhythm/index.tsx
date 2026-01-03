/**
 * Biorhythm Page
 * Main page for viewing biorhythm data
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiorhythm } from '../../hooks/useBiorhythm';
import { BioChart } from './BioChart';
import { DayDetail } from './DayDetail';
import { formatBiorhythmDate } from '../../services/biorhythm.service';
import './Biorhythm.css';

interface CircularGaugeProps {
  value: number;
  color: string;
  label: string;
  description: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ value, color, label, description }) => {
  const percentage = (value + 100) / 2;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isPositive = value >= 0;

  return (
    <div className="biorhythm-gauge">
      <div className="biorhythm-gauge__circle">
        <svg viewBox="0 0 100 100" className="biorhythm-gauge__svg">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out',
              filter: `drop-shadow(0 0 8px ${color}50)`,
            }}
          />
        </svg>
        <div className="biorhythm-gauge__value">
          <span
            className={`biorhythm-gauge__number ${isPositive ? 'biorhythm-gauge__number--positive' : 'biorhythm-gauge__number--negative'}`}
            style={{ color }}
          >
            {isPositive ? '+' : ''}{value}
          </span>
        </div>
      </div>
      <div className="biorhythm-gauge__label" style={{ color }}>{label}</div>
      <div className="biorhythm-gauge__description">{description}</div>
    </div>
  );
};

interface CompatibilityInputProps {
  onCalculate: (birthDate: string) => void;
  compatibility: ReturnType<typeof useBiorhythm>['compatibility'];
}

const CompatibilityInput: React.FC<CompatibilityInputProps> = ({ onCalculate, compatibility }) => {
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate) {
      onCalculate(birthDate);
    }
  };

  return (
    <div className="biorhythm-compatibility">
      <h3 className="biorhythm-compatibility__title">
        Compatibilidade de Biorritmos
      </h3>
      <p className="biorhythm-compatibility__subtitle">
        Compare sua sincronia com outra pessoa
      </p>

      <form onSubmit={handleSubmit} className="biorhythm-compatibility__form">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="biorhythm-compatibility__input"
          placeholder="Data de nascimento"
        />
        <button
          type="submit"
          className="biorhythm-compatibility__btn"
          disabled={!birthDate}
        >
          Calcular
        </button>
      </form>

      {compatibility && (
        <div className="biorhythm-compatibility__result">
          <div className="biorhythm-compatibility__overall">
            <div className="biorhythm-compatibility__overall-value">
              {compatibility.overall}%
            </div>
            <div className="biorhythm-compatibility__overall-label">
              Sincronia Geral
            </div>
          </div>

          <div className="biorhythm-compatibility__bars">
            <div className="biorhythm-compatibility__bar">
              <div className="biorhythm-compatibility__bar-label">
                <span style={{ color: '#FF6B6B' }}>Fisico</span>
                <span>{compatibility.physical}%</span>
              </div>
              <div className="biorhythm-compatibility__bar-track">
                <div
                  className="biorhythm-compatibility__bar-fill"
                  style={{
                    width: `${compatibility.physical}%`,
                    background: '#FF6B6B',
                  }}
                />
              </div>
            </div>

            <div className="biorhythm-compatibility__bar">
              <div className="biorhythm-compatibility__bar-label">
                <span style={{ color: '#4ECDC4' }}>Emocional</span>
                <span>{compatibility.emotional}%</span>
              </div>
              <div className="biorhythm-compatibility__bar-track">
                <div
                  className="biorhythm-compatibility__bar-fill"
                  style={{
                    width: `${compatibility.emotional}%`,
                    background: '#4ECDC4',
                  }}
                />
              </div>
            </div>

            <div className="biorhythm-compatibility__bar">
              <div className="biorhythm-compatibility__bar-label">
                <span style={{ color: '#45B7D1' }}>Intelectual</span>
                <span>{compatibility.intellectual}%</span>
              </div>
              <div className="biorhythm-compatibility__bar-track">
                <div
                  className="biorhythm-compatibility__bar-fill"
                  style={{
                    width: `${compatibility.intellectual}%`,
                    background: '#45B7D1',
                  }}
                />
              </div>
            </div>
          </div>

          <p className="biorhythm-compatibility__description">
            {compatibility.description}
          </p>
        </div>
      )}
    </div>
  );
};

export const BiorhythmPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    todayValues,
    chartData,
    criticalDays,
    compatibility,
    selectedDays,
    isLoading,
    setSelectedDays,
    calculateCompatibility,
  } = useBiorhythm();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="biorhythm-page">
        <div className="biorhythm-page__loading">
          <div className="biorhythm-page__spinner" />
          <span>Calculando seus biorritmos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="biorhythm-page">
      {/* Header */}
      <header className="biorhythm-page__header">
        <button className="biorhythm-page__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="biorhythm-page__title">Biorritmos</h1>
        <div className="biorhythm-page__spacer" />
      </header>

      {/* Today's Values */}
      <section className="biorhythm-page__section">
        <h2 className="biorhythm-page__section-title">
          Seus Biorritmos Hoje
        </h2>
        <div className="biorhythm-page__gauges">
          {todayValues.map((bio) => (
            <CircularGauge
              key={bio.type}
              value={bio.value}
              color={bio.color}
              label={bio.label}
              description={bio.description}
            />
          ))}
        </div>
      </section>

      {/* Chart Section */}
      <section className="biorhythm-page__section">
        <div className="biorhythm-page__chart-header">
          <h2 className="biorhythm-page__section-title">
            Grafico de Ciclos
          </h2>
          <div className="biorhythm-page__toggle">
            <button
              className={`biorhythm-page__toggle-btn ${selectedDays === 7 ? 'biorhythm-page__toggle-btn--active' : ''}`}
              onClick={() => setSelectedDays(7)}
            >
              7 dias
            </button>
            <button
              className={`biorhythm-page__toggle-btn ${selectedDays === 30 ? 'biorhythm-page__toggle-btn--active' : ''}`}
              onClick={() => setSelectedDays(30)}
            >
              30 dias
            </button>
          </div>
        </div>
        <BioChart
          data={chartData}
          onDayClick={setSelectedDate}
          selectedDate={selectedDate}
        />
      </section>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          data={chartData.find((d) => d.date === selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* Critical Days */}
      <section className="biorhythm-page__section">
        <h2 className="biorhythm-page__section-title">
          Dias Criticos
        </h2>
        <p className="biorhythm-page__section-subtitle">
          Dias em que seus ciclos cruzam o zero e requerem mais atencao
        </p>
        <div className="biorhythm-page__critical-list">
          {criticalDays.length > 0 ? (
            criticalDays.map((day, index) => (
              <div
                key={`${day.date}-${day.type}-${index}`}
                className="biorhythm-page__critical-item"
              >
                <div
                  className="biorhythm-page__critical-indicator"
                  style={{ background: day.color }}
                />
                <div className="biorhythm-page__critical-content">
                  <div className="biorhythm-page__critical-header">
                    <span className="biorhythm-page__critical-label" style={{ color: day.color }}>
                      {day.label}
                    </span>
                    <span className="biorhythm-page__critical-date">
                      {formatBiorhythmDate(day.date)}
                      {day.daysUntil > 0 && ` (em ${day.daysUntil} dias)`}
                    </span>
                  </div>
                  <p className="biorhythm-page__critical-advice">{day.advice}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="biorhythm-page__no-critical">
              Nenhum dia critico nos proximos 30 dias.
            </p>
          )}
        </div>
      </section>

      {/* Compatibility */}
      <section className="biorhythm-page__section">
        <CompatibilityInput
          onCalculate={calculateCompatibility}
          compatibility={compatibility}
        />
      </section>

      {/* Info Card */}
      <section className="biorhythm-page__info">
        <h3 className="biorhythm-page__info-title">O que sao Biorritmos?</h3>
        <p className="biorhythm-page__info-text">
          Biorritmos sao ciclos biologicos que influenciam diferentes aspectos da nossa vida:
        </p>
        <ul className="biorhythm-page__info-list">
          <li>
            <span style={{ color: '#FF6B6B' }}>Fisico (23 dias):</span> Energia, forca, resistencia e coordenacao
          </li>
          <li>
            <span style={{ color: '#4ECDC4' }}>Emocional (28 dias):</span> Humor, criatividade e sensibilidade
          </li>
          <li>
            <span style={{ color: '#45B7D1' }}>Intelectual (33 dias):</span> Raciocinio, memoria e concentracao
          </li>
        </ul>
        <p className="biorhythm-page__info-text">
          Valores positivos indicam fases de alta performance, enquanto valores negativos indicam periodos de recuperacao.
        </p>
      </section>
    </div>
  );
};

export default BiorhythmPage;
