/**
 * DayDetail Component
 * Modal showing detailed biorhythm values for a specific day
 */

import React from 'react';
import { DailyBiorhythm, formatBiorhythmDate } from '../../services/biorhythm.service';

interface DayDetailProps {
  date: string;
  data?: DailyBiorhythm;
  onClose: () => void;
}

interface ValueBarProps {
  label: string;
  value: number;
  color: string;
  description: string;
}

const ValueBar: React.FC<ValueBarProps> = ({ label, value, color, description }) => {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);
  const percentage = absValue;

  return (
    <div className="day-detail__value">
      <div className="day-detail__value-header">
        <span className="day-detail__value-label" style={{ color }}>{label}</span>
        <span
          className={`day-detail__value-number ${isPositive ? 'day-detail__value-number--positive' : 'day-detail__value-number--negative'}`}
          style={{ color }}
        >
          {isPositive ? '+' : ''}{value}
        </span>
      </div>
      <div className="day-detail__bar">
        <div className="day-detail__bar-track">
          {/* Center indicator */}
          <div className="day-detail__bar-center" />
          {/* Fill bar */}
          <div
            className={`day-detail__bar-fill ${isPositive ? 'day-detail__bar-fill--positive' : 'day-detail__bar-fill--negative'}`}
            style={{
              width: `${percentage / 2}%`,
              background: color,
              [isPositive ? 'left' : 'right']: '50%',
            }}
          />
        </div>
      </div>
      <p className="day-detail__value-description">{description}</p>
    </div>
  );
};

const getPhysicalDescription = (value: number): string => {
  if (value > 70) return 'Energia fisica em alta! Otimo para exercicios e atividades intensas.';
  if (value > 30) return 'Boa disposicao fisica. Aproveite para realizar tarefas que exigem esforco.';
  if (value > -30) return 'Energia moderada. Mantenha um ritmo equilibrado.';
  if (value > -70) return 'Energia em baixa. Priorize descanso e atividades leves.';
  return 'Momento de recuperacao. Evite esforcos excessivos e descanse bem.';
};

const getEmotionalDescription = (value: number): string => {
  if (value > 70) return 'Emocoes em harmonia! Excelente para conexoes e relacionamentos.';
  if (value > 30) return 'Equilibrio emocional. Bom momento para conversas importantes.';
  if (value > -30) return 'Emocoes estaveis. Mantenha a calma em situacoes de estresse.';
  if (value > -70) return 'Sensibilidade aumentada. Cuide do seu bem-estar emocional.';
  return 'Momento de introspecao. Evite decisoes impulsivas e pratique autocuidado.';
};

const getIntellectualDescription = (value: number): string => {
  if (value > 70) return 'Mente aguada! Perfeito para estudos, trabalho e resolucao de problemas.';
  if (value > 30) return 'Boa capacidade mental. Aproveite para projetos que exigem concentracao.';
  if (value > -30) return 'Pensamento equilibrado. Funcionalidade mental normal.';
  if (value > -70) return 'Capacidade mental reduzida. Evite tarefas muito complexas.';
  return 'Mente em repouso. Foque em tarefas simples e deixe decisoes importantes para depois.';
};

const getOverallAdvice = (physical: number, emotional: number, intellectual: number): string => {
  const average = (physical + emotional + intellectual) / 3;

  if (average > 50) {
    return 'Dia excelente em todos os aspectos! Aproveite para realizar atividades importantes e tomar decisoes significativas.';
  }
  if (average > 20) {
    return 'Dia positivo no geral. Voce esta em boa forma para enfrentar os desafios do dia.';
  }
  if (average > -20) {
    return 'Dia equilibrado. Mantenha um ritmo moderado e foque nas tarefas essenciais.';
  }
  if (average > -50) {
    return 'Dia para ter cautela. Evite decisoes importantes e cuide do seu bem-estar.';
  }
  return 'Dia desafiador. Priorize descanso e autocuidado. Deixe grandes decisoes para outro momento.';
};

export const DayDetail: React.FC<DayDetailProps> = ({ date, data, onClose }) => {
  if (!data) {
    return null;
  }

  const formattedDate = formatBiorhythmDate(date);
  const fullDate = new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="day-detail__overlay" onClick={onClose}>
      <div className="day-detail" onClick={(e) => e.stopPropagation()}>
        <button className="day-detail__close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="day-detail__header">
          <h2 className="day-detail__title">{formattedDate}</h2>
          <p className="day-detail__subtitle">{fullDate}</p>
        </div>

        <div className="day-detail__values">
          <ValueBar
            label="Fisico"
            value={data.physical}
            color="#FF6B6B"
            description={getPhysicalDescription(data.physical)}
          />
          <ValueBar
            label="Emocional"
            value={data.emotional}
            color="#4ECDC4"
            description={getEmotionalDescription(data.emotional)}
          />
          <ValueBar
            label="Intelectual"
            value={data.intellectual}
            color="#45B7D1"
            description={getIntellectualDescription(data.intellectual)}
          />
        </div>

        <div className="day-detail__advice">
          <h3 className="day-detail__advice-title">Conselho do Dia</h3>
          <p className="day-detail__advice-text">
            {getOverallAdvice(data.physical, data.emotional, data.intellectual)}
          </p>
        </div>

        <div className="day-detail__summary">
          <div className="day-detail__summary-item">
            <span className="day-detail__summary-label">Media Geral</span>
            <span className="day-detail__summary-value">
              {Math.round((data.physical + data.emotional + data.intellectual) / 3)}
            </span>
          </div>
          <div className="day-detail__summary-item">
            <span className="day-detail__summary-label">Melhor Ciclo</span>
            <span className="day-detail__summary-value">
              {data.physical >= data.emotional && data.physical >= data.intellectual
                ? 'Fisico'
                : data.emotional >= data.intellectual
                  ? 'Emocional'
                  : 'Intelectual'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetail;
