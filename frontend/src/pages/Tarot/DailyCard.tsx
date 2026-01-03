/**
 * DailyCard Component
 * Displays the daily tarot card with flip animation
 */

import React, { useState, useEffect } from 'react';
import { DailyCard as DailyCardType, tarotService } from '../../services/tarot.service';

interface DailyCardProps {
  dailyCard: DailyCardType;
  onCardClick: () => void;
}

export const DailyCard: React.FC<DailyCardProps> = ({ dailyCard, onCardClick }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { card } = dailyCard;
  const suitInfo = tarotService.getSuitInfo(card.suit);

  // Check if card was already revealed today
  useEffect(() => {
    const revealedKey = `tarot_daily_revealed_${dailyCard.date}`;
    const wasRevealed = localStorage.getItem(revealedKey);
    if (wasRevealed) {
      setIsRevealed(true);
    }
  }, [dailyCard.date]);

  const handleReveal = () => {
    if (isRevealed || isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
      // Save revealed state
      localStorage.setItem(`tarot_daily_revealed_${dailyCard.date}`, 'true');
    }, 600);
  };

  return (
    <section className="daily-card">
      <h2 className="daily-card__title">
        <span>☀️</span> Sua Carta do Dia
      </h2>
      <p className="daily-card__subtitle">
        Toque na carta para revelar a mensagem do universo para hoje
      </p>

      {/* Card Container */}
      <div className="daily-card__container">
        <div
          className={`daily-card__card ${isFlipping ? 'daily-card__card--flipping' : ''} ${
            isRevealed ? 'daily-card__card--revealed' : ''
          }`}
          onClick={isRevealed ? onCardClick : handleReveal}
        >
          {/* Card Back */}
          <div className="daily-card__back">
            <div className="daily-card__back-pattern">
              <div className="daily-card__back-star">✦</div>
              <div className="daily-card__back-circle">
                <span>🌙</span>
              </div>
              <div className="daily-card__back-text">TARO</div>
            </div>
            <div className="daily-card__back-glow" />
          </div>

          {/* Card Front */}
          <div
            className="daily-card__front"
            style={{
              background: `linear-gradient(135deg, ${card.imageGradient[0]}, ${card.imageGradient[1]})`,
            }}
          >
            {/* Card Glow Effect */}
            <div className="daily-card__front-glow" />

            {/* Card Number */}
            {card.number !== null && (
              <div className="daily-card__number">{card.number}</div>
            )}

            {/* Suit Badge */}
            <div className="daily-card__suit">
              <span className="daily-card__suit-icon">{suitInfo.icon}</span>
              <span className="daily-card__suit-name">{suitInfo.name}</span>
            </div>

            {/* Card Symbol/Image Placeholder */}
            <div className="daily-card__image">
              <div className="daily-card__image-symbol">
                {card.suit === 'major' ? '★' : suitInfo.icon}
              </div>
            </div>

            {/* Card Name */}
            <div className="daily-card__name">{card.name}</div>

            {/* Reversed Indicator */}
            {card.isReversed && (
              <div className="daily-card__reversed">Invertida</div>
            )}

            {/* Keywords */}
            <div className="daily-card__keywords">
              {card.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="daily-card__keyword">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sparkle Effects */}
        {isRevealed && (
          <div className="daily-card__sparkles">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="daily-card__sparkle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Interpretation */}
      {isRevealed && (
        <div className="daily-card__interpretation">
          {/* Personal Message */}
          <div className="daily-card__message">
            <span className="daily-card__message-icon">✨</span>
            <p>{dailyCard.personalMessage}</p>
          </div>

          {/* Meaning */}
          <div className="daily-card__meaning">
            <h3>Significado</h3>
            <p>{card.isReversed ? card.meaningReversed : card.meaningUpright}</p>
          </div>

          {/* Advice */}
          <div className="daily-card__advice">
            <h3>Conselho do Dia</h3>
            <p>{card.advice}</p>
          </div>

          {/* Areas */}
          <div className="daily-card__areas">
            <div className="daily-card__area">
              <div className="daily-card__area-icon">❤️</div>
              <div className="daily-card__area-content">
                <h4>Amor</h4>
                <p>{card.loveAdvice}</p>
              </div>
            </div>
            <div className="daily-card__area">
              <div className="daily-card__area-icon">💼</div>
              <div className="daily-card__area-content">
                <h4>Trabalho</h4>
                <p>{card.workAdvice}</p>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button className="daily-card__details-btn" onClick={onCardClick}>
            <span>🔮</span>
            Ver detalhes da carta
          </button>
        </div>
      )}

      {/* Tap Hint */}
      {!isRevealed && (
        <div className="daily-card__hint">
          <div className="daily-card__hint-icon">👆</div>
          <p>Toque para revelar</p>
        </div>
      )}
    </section>
  );
};

export default DailyCard;
