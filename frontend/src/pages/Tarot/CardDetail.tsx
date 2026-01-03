/**
 * CardDetail Component
 * Modal showing full tarot card details
 */

import React from 'react';
import { TarotCard, tarotService } from '../../services/tarot.service';

interface CardDetailProps {
  card: TarotCard;
  onClose: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
  const suitInfo = tarotService.getSuitInfo(card.suit);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="card-detail" onClick={handleBackdropClick}>
      <div className="card-detail__content">
        {/* Close Button */}
        <button className="card-detail__close" onClick={onClose}>
          ×
        </button>

        {/* Card Visual */}
        <div className="card-detail__card-container">
          <div
            className={`card-detail__card ${card.isReversed ? 'card-detail__card--reversed' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${card.imageGradient[0]}, ${card.imageGradient[1]})`,
            }}
          >
            {/* Glow Effect */}
            <div className="card-detail__card-glow" />

            {/* Number */}
            {card.number !== null && (
              <div className="card-detail__card-number">{card.number}</div>
            )}

            {/* Suit Badge */}
            <div className="card-detail__card-suit">
              <span>{suitInfo.icon}</span>
            </div>

            {/* Symbol */}
            <div className="card-detail__card-symbol">
              {card.suit === 'major' ? '★' : suitInfo.icon}
            </div>

            {/* Name */}
            <div className="card-detail__card-name">{card.name}</div>

            {/* English Name */}
            <div className="card-detail__card-name-en">{card.nameEn}</div>

            {/* Reversed Indicator */}
            {card.isReversed && (
              <div className="card-detail__card-reversed-badge">
                ↓ Invertida
              </div>
            )}
          </div>

          {/* Sparkles */}
          <div className="card-detail__sparkles">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="card-detail__sparkle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Card Info */}
        <div className="card-detail__info">
          {/* Title */}
          <h2 className="card-detail__title">{card.name}</h2>
          <p className="card-detail__subtitle">
            {suitInfo.name}
            {card.number !== null && ` - ${card.number}`}
          </p>

          {/* Keywords */}
          <div className="card-detail__keywords">
            {card.keywords.map((keyword, index) => (
              <span key={index} className="card-detail__keyword">
                {keyword}
              </span>
            ))}
          </div>

          {/* Meaning Section */}
          <div className="card-detail__section">
            <h3 className="card-detail__section-title">
              <span>✨</span>
              {card.isReversed ? 'Significado (Invertida)' : 'Significado'}
            </h3>
            <p className="card-detail__section-text">
              {card.isReversed ? card.meaningReversed : card.meaningUpright}
            </p>
          </div>

          {/* Advice Section */}
          <div className="card-detail__section">
            <h3 className="card-detail__section-title">
              <span>💫</span>
              Conselho
            </h3>
            <p className="card-detail__section-text">{card.advice}</p>
          </div>

          {/* Areas Grid */}
          <div className="card-detail__areas">
            <div className="card-detail__area">
              <div className="card-detail__area-header">
                <span className="card-detail__area-icon">❤️</span>
                <h4>Amor</h4>
              </div>
              <p>{card.loveAdvice}</p>
            </div>

            <div className="card-detail__area">
              <div className="card-detail__area-header">
                <span className="card-detail__area-icon">💼</span>
                <h4>Trabalho</h4>
              </div>
              <p>{card.workAdvice}</p>
            </div>
          </div>

          {/* Reversed Meaning (if upright, show what reversed would mean) */}
          {!card.isReversed && (
            <div className="card-detail__section card-detail__section--reversed">
              <h3 className="card-detail__section-title">
                <span>↓</span>
                Se Invertida
              </h3>
              <p className="card-detail__section-text">{card.meaningReversed}</p>
            </div>
          )}

          {/* Upright Meaning (if reversed, show what upright would mean) */}
          {card.isReversed && (
            <div className="card-detail__section card-detail__section--upright">
              <h3 className="card-detail__section-title">
                <span>↑</span>
                Se Normal
              </h3>
              <p className="card-detail__section-text">{card.meaningUpright}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="card-detail__action" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CardDetail;
