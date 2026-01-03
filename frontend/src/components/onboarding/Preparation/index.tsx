/**
 * ==============================================================================
 * Preparation Component - Preparacao
 * ==============================================================================
 *
 * Tela de preparacao antes do quiz com visualizacao do mapa astral
 * e informacoes sobre o processo.
 *
 * @example
 * <Preparation onReady={() => console.log('Ready')} />
 *
 * @module components/onboarding
 */
import React from 'react';
import './Preparation.css';

export interface PreparationProps {
  onReady: () => void;
  className?: string;
}

// Simplified Astral Chart SVG Component
const AstralChart: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="astral-chart"
    aria-label="Ilustracao de mapa astral"
    role="img"
  >
    {/* Outer circle */}
    <circle cx="100" cy="100" r="95" stroke="url(#gradient1)" strokeWidth="2" opacity="0.8" />
    <circle cx="100" cy="100" r="80" stroke="url(#gradient1)" strokeWidth="1" opacity="0.5" />
    <circle cx="100" cy="100" r="60" stroke="url(#gradient1)" strokeWidth="1" opacity="0.4" />
    <circle cx="100" cy="100" r="40" stroke="url(#gradient1)" strokeWidth="1" opacity="0.3" />

    {/* Division lines (12 houses) */}
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x1 = 100 + 40 * Math.cos(angle);
      const y1 = 100 + 40 * Math.sin(angle);
      const x2 = 100 + 95 * Math.cos(angle);
      const y2 = 100 + 95 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#gradient1)"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    })}

    {/* Zodiac symbols placeholder dots */}
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 75) * (Math.PI / 180);
      const x = 100 + 87 * Math.cos(angle);
      const y = 100 + 87 * Math.sin(angle);
      return (
        <circle
          key={`dot-${i}`}
          cx={x}
          cy={y}
          r="4"
          fill="url(#gradient2)"
          className="astral-chart__symbol"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      );
    })}

    {/* Center decoration */}
    <circle cx="100" cy="100" r="20" fill="url(#gradient2)" opacity="0.3" />
    <circle cx="100" cy="100" r="8" fill="url(#gradient2)" opacity="0.8" />

    {/* Planet positions (stylized dots) */}
    <circle cx="70" cy="60" r="5" fill="#fbbf24" className="astral-chart__planet" />
    <circle cx="130" cy="75" r="4" fill="#f87171" className="astral-chart__planet" style={{ animationDelay: '0.5s' }} />
    <circle cx="85" cy="140" r="4" fill="#60a5fa" className="astral-chart__planet" style={{ animationDelay: '1s' }} />
    <circle cx="145" cy="120" r="3" fill="#a78bfa" className="astral-chart__planet" style={{ animationDelay: '1.5s' }} />
    <circle cx="55" cy="100" r="3" fill="#34d399" className="astral-chart__planet" style={{ animationDelay: '2s' }} />

    {/* Aspect lines */}
    <line x1="70" y1="60" x2="130" y2="75" stroke="#fbbf24" strokeWidth="1" opacity="0.4" strokeDasharray="4,4" />
    <line x1="70" y1="60" x2="85" y2="140" stroke="#60a5fa" strokeWidth="1" opacity="0.4" strokeDasharray="4,4" />
    <line x1="130" y1="75" x2="145" y2="120" stroke="#a78bfa" strokeWidth="1" opacity="0.4" strokeDasharray="4,4" />

    {/* Gradients */}
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SparkleIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

interface BulletPointProps {
  children: React.ReactNode;
  delay?: number;
}

const BulletPoint: React.FC<BulletPointProps> = ({ children, delay = 0 }) => (
  <li className="preparation__bullet" style={{ animationDelay: `${delay}s` }}>
    <span className="preparation__bullet-icon">
      <CheckIcon />
    </span>
    <span className="preparation__bullet-text">{children}</span>
  </li>
);

export const Preparation: React.FC<PreparationProps> = ({ onReady, className = '' }) => {
  return (
    <div className={`preparation ${className}`}>
      {/* Background decorations */}
      <div className="preparation__bg" aria-hidden="true">
        <div className="preparation__stars">
          <div className="star star--1" />
          <div className="star star--2" />
          <div className="star star--3" />
          <div className="star star--4" />
          <div className="star star--5" />
        </div>
      </div>

      <div className="preparation__content">
        {/* Header */}
        <header className="preparation__header">
          <div className="preparation__header-icon">
            <SparkleIcon />
          </div>
          <h1 className="preparation__title">Preparar</h1>
          <p className="preparation__subtitle">
            Sua jornada de autoconhecimento comeca agora
          </p>
        </header>

        {/* Astral Chart Visualization */}
        <div className="preparation__chart-wrapper">
          <div className="preparation__chart-glow" aria-hidden="true" />
          <AstralChart />
        </div>

        {/* Bullet Points */}
        <ul className="preparation__bullets" aria-label="O que esperar">
          <BulletPoint delay={0.1}>
            A analise contem 12 aspectos do seu mapa
          </BulletPoint>
          <BulletPoint delay={0.2}>
            Esteja pronto para uma jornada de autoconhecimento de 3 a 5 minutos
          </BulletPoint>
          <BulletPoint delay={0.3}>
            Cada pergunta nos ajuda a criar sua leitura unica
          </BulletPoint>
        </ul>

        {/* Ready Button */}
        <button
          type="button"
          className="preparation__button"
          onClick={onReady}
          aria-label="Comecar a jornada"
        >
          <span>Estou pronto!</span>
        </button>
      </div>
    </div>
  );
};

export default Preparation;
