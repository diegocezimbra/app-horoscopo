/**
 * MoonPhase Component
 * Displays the current moon phase with visual representation
 */

import React from 'react';
import { CurrentMoonData } from '../../services/lunar.service';

interface MoonPhaseProps {
  moonData: CurrentMoonData;
}

// SVG Moon Component with glow effect
const MoonSVG: React.FC<{ illumination: number; phase: string }> = ({ illumination, phase }) => {
  // Determine if moon is waxing for shadow direction
  const isWaxing = phase.includes('waxing') || phase === 'first-quarter';
  const isNew = phase === 'new-moon';
  const isFull = phase === 'full-moon';

  // Calculate shadow position based on illumination
  const shadowOffset = isFull ? 0 : isNew ? 100 : (100 - illumination);

  return (
    <svg
      className="lunar-page__moon-svg"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow effect */}
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outer glow */}
        <filter id="outerGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feFlood floodColor="#C0C0C0" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for moon surface */}
        <radialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E8E8E8" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </radialGradient>

        {/* Shadow gradient */}
        <linearGradient
          id="moonShadow"
          x1={isWaxing ? '100%' : '0%'}
          y1="0%"
          x2={isWaxing ? '0%' : '100%'}
          y2="0%"
        >
          <stop offset="0%" stopColor="#0a0a2a" stopOpacity="0.95" />
          <stop offset={`${shadowOffset}%`} stopColor="#0a0a2a" stopOpacity="0.95" />
          <stop offset={`${Math.min(shadowOffset + 15, 100)}%`} stopColor="#0a0a2a" stopOpacity="0" />
        </linearGradient>

        {/* Clip path for shadow */}
        <clipPath id="moonClip">
          <circle cx="100" cy="100" r="70" />
        </clipPath>
      </defs>

      {/* Outer glow circle */}
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="none"
        stroke="#C0C0C0"
        strokeWidth="1"
        opacity="0.3"
        filter="url(#outerGlow)"
      />

      {/* Moon base */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="url(#moonSurface)"
        filter="url(#moonGlow)"
      />

      {/* Crater details */}
      <g opacity="0.15">
        <circle cx="75" cy="80" r="12" fill="#888" />
        <circle cx="120" cy="70" r="8" fill="#888" />
        <circle cx="90" cy="120" r="15" fill="#888" />
        <circle cx="130" cy="110" r="10" fill="#888" />
        <circle cx="65" cy="110" r="6" fill="#888" />
        <circle cx="110" cy="140" r="7" fill="#888" />
      </g>

      {/* Shadow overlay for phase */}
      {!isFull && (
        <g clipPath="url(#moonClip)">
          <rect
            x={isWaxing ? 100 - (shadowOffset * 1.4) : 30}
            y="30"
            width="140"
            height="140"
            fill="url(#moonShadow)"
          />
        </g>
      )}

      {/* New moon overlay */}
      {isNew && (
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="#0a0a2a"
          opacity="0.9"
        />
      )}
    </svg>
  );
};

export const MoonPhase: React.FC<MoonPhaseProps> = ({ moonData }) => {
  return (
    <section className="lunar-page__current-phase">
      {/* Moon visualization */}
      <div className="lunar-page__moon-container">
        <div className="lunar-page__moon-glow" />
        <MoonSVG illumination={moonData.illumination} phase={moonData.phase} />
        <div className="lunar-page__moon-emoji">{moonData.emoji}</div>
      </div>

      {/* Phase info */}
      <div className="lunar-page__phase-info">
        <h2 className="lunar-page__phase-name">{moonData.name}</h2>
        <p className="lunar-page__moon-sign">
          Lua em <span>{moonData.signName}</span>
        </p>
        <div className="lunar-page__illumination">
          <div className="lunar-page__illumination-bar">
            <div
              className="lunar-page__illumination-fill"
              style={{ width: `${moonData.illumination}%` }}
            />
          </div>
          <span className="lunar-page__illumination-value">
            {moonData.illumination}% iluminada
          </span>
        </div>
      </div>

      {/* Energy card */}
      <div className="lunar-page__energy-card">
        <div className="lunar-page__energy-icon">&#x2728;</div>
        <div className="lunar-page__energy-content">
          <h3 className="lunar-page__energy-title">Energia do Momento</h3>
          <p className="lunar-page__energy-value">{moonData.energy}</p>
          <p className="lunar-page__energy-description">{moonData.description}</p>
        </div>
      </div>

      {/* Rituals section */}
      <div className="lunar-page__info-section">
        <h3 className="lunar-page__section-title">
          <span>&#x1F52E;</span> Rituais Sugeridos
        </h3>
        <ul className="lunar-page__ritual-list">
          {moonData.rituals.slice(0, 4).map((ritual, index) => (
            <li key={index} className="lunar-page__ritual-item">
              <span className="lunar-page__ritual-bullet">&#x2022;</span>
              {ritual}
            </li>
          ))}
        </ul>
      </div>

      {/* Crystals section */}
      <div className="lunar-page__info-section">
        <h3 className="lunar-page__section-title">
          <span>&#x1F48E;</span> Cristais Recomendados
        </h3>
        <div className="lunar-page__crystals">
          {moonData.crystals.map((crystal, index) => (
            <span key={index} className="lunar-page__crystal-tag">
              {crystal}
            </span>
          ))}
        </div>
      </div>

      {/* Colors section */}
      <div className="lunar-page__info-section">
        <h3 className="lunar-page__section-title">
          <span>&#x1F3A8;</span> Cores do Dia
        </h3>
        <div className="lunar-page__colors">
          {moonData.colors.map((color, index) => (
            <div key={index} className="lunar-page__color-item">
              <div
                className="lunar-page__color-swatch"
                style={{ backgroundColor: moonData.colorHexes[index] }}
              />
              <span className="lunar-page__color-name">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoonPhase;
