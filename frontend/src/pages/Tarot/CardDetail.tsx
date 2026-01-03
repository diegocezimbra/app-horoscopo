/**
 * CardDetail Component
 * Modal showing full tarot card details
 */

import React, { useState, useEffect } from 'react';
import { TarotCard, TarotSuit, SuitInfo, tarotService } from '../../services/tarot.service';

interface CardDetailProps {
  card: TarotCard;
  isReversed?: boolean;
  onClose: () => void;
}

// Fallback suit info for when API is unavailable
const FALLBACK_SUIT_INFO: Record<TarotSuit, { icon: string; name: string }> = {
  major: { icon: '★', name: 'Arcanos Maiores' },
  wands: { icon: '🪄', name: 'Paus' },
  cups: { icon: '🏆', name: 'Copas' },
  swords: { icon: '⚔️', name: 'Espadas' },
  pentacles: { icon: '⭐', name: 'Ouros' },
};

// Generate gradient colors based on suit
const getSuitGradient = (suit: TarotSuit = 'major'): [string, string] => {
  switch (suit) {
    case 'major':
      return ['#7C3AED', '#4C1D95'];
    case 'wands':
      return ['#DC2626', '#991B1B'];
    case 'cups':
      return ['#2563EB', '#1D4ED8'];
    case 'swords':
      return ['#64748B', '#475569'];
    case 'pentacles':
      return ['#16A34A', '#166534'];
    default:
      return ['#7C3AED', '#4C1D95'];
  }
};

export const CardDetail: React.FC<CardDetailProps> = ({ card, isReversed = false, onClose }) => {
  const [suitInfo, setSuitInfo] = useState<SuitInfo | null>(null);
  const suit = card.suit || 'major';
  const fallbackInfo = FALLBACK_SUIT_INFO[suit];
  const gradient = getSuitGradient(suit);

  useEffect(() => {
    const loadSuitInfo = async () => {
      try {
        const info = await tarotService.getSuitInfo(suit);
        setSuitInfo(info);
      } catch {
        // Use fallback
      }
    };
    loadSuitInfo();
  }, [suit]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const suitIcon = suitInfo?.name ? '✨' : fallbackInfo.icon;
  const suitName = suitInfo?.name || fallbackInfo.name;

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
            className={`card-detail__card ${isReversed ? 'card-detail__card--reversed' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
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
              <span>{suitIcon}</span>
            </div>

            {/* Symbol */}
            <div className="card-detail__card-symbol">
              {suit === 'major' ? '★' : suitIcon}
            </div>

            {/* Name */}
            <div className="card-detail__card-name">{card.name}</div>

            {/* English Name */}
            <div className="card-detail__card-name-en">{card.nameEn}</div>

            {/* Reversed Indicator */}
            {isReversed && (
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
            {suitName}
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
              {isReversed ? 'Significado (Invertida)' : 'Significado'}
            </h3>
            <p className="card-detail__section-text">
              {isReversed ? card.meaningReversed : card.meaningUpright}
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
              <p>{card.careerAdvice}</p>
            </div>
          </div>

          {/* Reversed Meaning (if upright, show what reversed would mean) */}
          {!isReversed && (
            <div className="card-detail__section card-detail__section--reversed">
              <h3 className="card-detail__section-title">
                <span>↓</span>
                Se Invertida
              </h3>
              <p className="card-detail__section-text">{card.meaningReversed}</p>
            </div>
          )}

          {/* Upright Meaning (if reversed, show what upright would mean) */}
          {isReversed && (
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
