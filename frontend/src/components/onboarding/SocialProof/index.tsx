/**
 * ==============================================================================
 * SocialProof Component - Prova Social
 * ==============================================================================
 *
 * Tela de prova social com depoimento, avaliação e logos de mídia.
 * Cria credibilidade e confiança no usuário.
 *
 * @example
 * <SocialProof onContinue={() => console.log('Continue')} />
 *
 * @module components/onboarding
 */
import React from 'react';
import './SocialProof.css';

export interface SocialProofProps {
  onContinue: () => void;
  className?: string;
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? '#00b67a' : 'none'}
    stroke={filled ? '#00b67a' : '#4a5568'}
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="star-rating" role="img" aria-label={`${rating} de ${maxRating} estrelas`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
};

const QuoteIcon: React.FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
  </svg>
);

const ArrowRightIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Media logo components (simplified placeholders)
const MediaLogo: React.FC<{ name: string }> = ({ name }) => (
  <div className="media-logo" aria-label={name}>
    <span className="media-logo__text">{name}</span>
  </div>
);

export const SocialProof: React.FC<SocialProofProps> = ({ onContinue, className = '' }) => {
  return (
    <div className={`social-proof ${className}`}>
      {/* Background decorations */}
      <div className="social-proof__bg" aria-hidden="true">
        <div className="social-proof__orb social-proof__orb--1" />
        <div className="social-proof__orb social-proof__orb--2" />
      </div>

      <div className="social-proof__content">
        {/* Header */}
        <header className="social-proof__header">
          <h1 className="social-proof__title">
            Veja como nosso teste fornece informações reais
          </h1>
        </header>

        {/* Testimonial Card */}
        <article className="testimonial-card" aria-label="Depoimento de cliente">
          <div className="testimonial-card__quote-icon">
            <QuoteIcon />
          </div>

          <blockquote className="testimonial-card__text">
            "Eu estava cética no começo, mas as informações sobre minha personalidade
            e meu caminho de vida foram incrivelmente precisas. Descobri aspectos de mim
            mesma que nunca tinha percebido. Recomendo para todos que buscam autoconhecimento!"
          </blockquote>

          <footer className="testimonial-card__footer">
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">
                <span>MC</span>
              </div>
              <div className="testimonial-card__info">
                <cite className="testimonial-card__name">Maria Clara</cite>
                <span className="testimonial-card__location">Sao Paulo, Brasil</span>
              </div>
            </div>

            <div className="testimonial-card__rating">
              <StarRating rating={5} />
              <span className="testimonial-card__rating-label">Trustpilot</span>
            </div>
          </footer>
        </article>

        {/* Media Mentions */}
        <section className="media-mentions" aria-labelledby="media-mentions-title">
          <h2 id="media-mentions-title" className="media-mentions__title">
            Mencionado em
          </h2>
          <div className="media-mentions__logos">
            <MediaLogo name="Forbes" />
            <MediaLogo name="Yahoo!" />
            <MediaLogo name="TechRadar" />
            <MediaLogo name="Mirror" />
            <MediaLogo name="Daily Mail" />
          </div>
        </section>

        {/* Continue Button */}
        <button
          type="button"
          className="social-proof__button"
          onClick={onContinue}
          aria-label="Continuar para o proximo passo"
        >
          <span>Continuar</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default SocialProof;
