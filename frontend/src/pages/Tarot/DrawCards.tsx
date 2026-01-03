/**
 * DrawCards Component
 * Interactive tarot card drawing with animations
 */

import React, { useState } from 'react';
import {
  TarotReading,
  ReadingType,
  TarotCard,
  CardPosition,
  tarotService,
} from '../../services/tarot.service';

interface DrawCardsProps {
  currentReading: TarotReading | null;
  isShuffling: boolean;
  onStartReading: (type: ReadingType) => void;
  onRevealCard: (positionId: string) => void;
  onRevealAll: () => void;
  onClearReading: () => void;
  onCardClick: (card: TarotCard) => void;
  getReadingTypeInfo: (type: ReadingType) => { name: string; description: string; cardCount: number };
}

const READING_TYPES: ReadingType[] = ['single', 'three-card', 'celtic-cross'];

export const DrawCards: React.FC<DrawCardsProps> = ({
  currentReading,
  isShuffling,
  onStartReading,
  onRevealCard,
  onRevealAll,
  onClearReading,
  onCardClick,
  getReadingTypeInfo,
}) => {
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);

  const handleSelectType = (type: ReadingType) => {
    setSelectedType(type);
  };

  const handleStartReading = () => {
    if (selectedType) {
      onStartReading(selectedType);
    }
  };

  const handleCardReveal = (position: CardPosition) => {
    if (!position.isRevealed) {
      onRevealCard(position.id);
    } else if (position.card) {
      onCardClick(position.card);
    }
  };

  const allRevealed = currentReading?.positions.every((p) => p.isRevealed);
  const revealedCount = currentReading?.positions.filter((p) => p.isRevealed).length || 0;

  // If no reading is in progress, show type selection
  if (!currentReading && !isShuffling) {
    return (
      <section className="draw-cards">
        <h2 className="draw-cards__title">
          <span>🎴</span> Fazer uma Tiragem
        </h2>
        <p className="draw-cards__subtitle">
          Escolha o tipo de tiragem para receber orientacao do taro
        </p>

        {/* Reading Type Options */}
        <div className="draw-cards__types">
          {READING_TYPES.map((type) => {
            const info = getReadingTypeInfo(type);
            return (
              <button
                key={type}
                className={`draw-cards__type ${
                  selectedType === type ? 'draw-cards__type--selected' : ''
                }`}
                onClick={() => handleSelectType(type)}
              >
                <div className="draw-cards__type-cards">
                  {Array.from({ length: Math.min(info.cardCount, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="draw-cards__type-card"
                      style={{
                        transform: `rotate(${(i - 1) * 10}deg) translateY(${Math.abs(i - 1) * 5}px)`,
                      }}
                    />
                  ))}
                  {info.cardCount > 3 && (
                    <span className="draw-cards__type-more">+{info.cardCount - 3}</span>
                  )}
                </div>
                <div className="draw-cards__type-info">
                  <span className="draw-cards__type-name">{info.name}</span>
                  <span className="draw-cards__type-desc">{info.description}</span>
                </div>
                {selectedType === type && (
                  <div className="draw-cards__type-check">✓</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          className="draw-cards__start-btn"
          disabled={!selectedType}
          onClick={handleStartReading}
        >
          <span>🔮</span>
          Embaralhar e Tirar
        </button>
      </section>
    );
  }

  // Shuffling Animation
  if (isShuffling) {
    return (
      <section className="draw-cards draw-cards--shuffling">
        <div className="draw-cards__shuffle">
          <div className="draw-cards__shuffle-deck">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="draw-cards__shuffle-card"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <p className="draw-cards__shuffle-text">Embaralhando as cartas...</p>
          <p className="draw-cards__shuffle-hint">
            Concentre-se em sua pergunta ou intencao
          </p>
        </div>
      </section>
    );
  }

  // Reading in progress
  if (currentReading) {
    const info = getReadingTypeInfo(currentReading.type);

    return (
      <section className="draw-cards draw-cards--reading">
        <div className="draw-cards__reading-header">
          <h2 className="draw-cards__reading-title">{info.name}</h2>
          <span className="draw-cards__reading-progress">
            {revealedCount}/{currentReading.positions.length} reveladas
          </span>
        </div>

        {/* Cards Layout */}
        <div
          className={`draw-cards__layout draw-cards__layout--${currentReading.type}`}
        >
          {currentReading.positions.map((position, index) => {
            const suitInfo = position.card
              ? tarotService.getSuitInfo(position.card.suit)
              : null;

            return (
              <div
                key={position.id}
                className={`draw-cards__position draw-cards__position--${position.id}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Position Label */}
                <div className="draw-cards__position-label">
                  <span className="draw-cards__position-name">{position.name}</span>
                </div>

                {/* Card */}
                <div
                  className={`draw-cards__card ${
                    position.isRevealed ? 'draw-cards__card--revealed' : ''
                  }`}
                  onClick={() => handleCardReveal(position)}
                >
                  {/* Card Back */}
                  <div className="draw-cards__card-back">
                    <div className="draw-cards__card-back-pattern">
                      <span>✦</span>
                    </div>
                    <div className="draw-cards__card-tap">
                      Toque
                    </div>
                  </div>

                  {/* Card Front */}
                  {position.card && (
                    <div
                      className="draw-cards__card-front"
                      style={{
                        background: `linear-gradient(135deg, ${position.card.imageGradient[0]}, ${position.card.imageGradient[1]})`,
                      }}
                    >
                      {position.card.number !== null && (
                        <div className="draw-cards__card-number">
                          {position.card.number}
                        </div>
                      )}
                      <div className="draw-cards__card-symbol">
                        {suitInfo?.icon}
                      </div>
                      <div className="draw-cards__card-name">
                        {position.card.name}
                      </div>
                      {position.card.isReversed && (
                        <div className="draw-cards__card-reversed">↓</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Position Description */}
                {position.isRevealed && (
                  <div className="draw-cards__position-desc">
                    {position.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="draw-cards__actions">
          {!allRevealed && (
            <button className="draw-cards__action-btn" onClick={onRevealAll}>
              <span>👁️</span>
              Revelar Todas
            </button>
          )}

          {allRevealed && (
            <>
              {/* Interpretation */}
              <div className="draw-cards__interpretation">
                <h3>
                  <span>🌟</span> Interpretacao
                </h3>
                <p>{currentReading.interpretation}</p>
              </div>

              <button
                className="draw-cards__action-btn draw-cards__action-btn--primary"
                onClick={onClearReading}
              >
                <span>🔄</span>
                Nova Tiragem
              </button>
            </>
          )}
        </div>
      </section>
    );
  }

  return null;
};

export default DrawCards;
