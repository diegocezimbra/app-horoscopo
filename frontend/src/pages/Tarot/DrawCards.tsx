/**
 * DrawCards Component
 * Interactive tarot card drawing with animations
 */

import React, { useState, useEffect } from 'react';
import {
  TarotReading,
  ReadingType,
  TarotCard,
  DrawnCard,
  TarotSuit,
  SuitInfo,
  tarotService,
} from '../../services/tarot.service';

interface DrawCardsProps {
  currentReading: TarotReading | null;
  isShuffling: boolean;
  onStartReading: (type: ReadingType) => void;
  onRevealCard: (position: number) => void;
  onRevealAll: () => void;
  onClearReading: () => void;
  onCardClick: (card: TarotCard, isReversed: boolean) => void;
  getReadingTypeInfo: (type: ReadingType) => { name: string; description: string; cardCount: number };
}

const READING_TYPES: ReadingType[] = ['single', 'past-present-future', 'celtic-cross'];

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
  const [revealedPositions, setRevealedPositions] = useState<Set<number>>(new Set());
  const [suitsInfo, setSuitsInfo] = useState<Record<string, SuitInfo>>({});

  // Load suits info
  useEffect(() => {
    const loadSuitsInfo = async () => {
      try {
        const suits = await tarotService.getSuitsInfo();
        const suitsMap: Record<string, SuitInfo> = {};
        suits.forEach((suit) => {
          suitsMap[suit.id] = suit;
        });
        setSuitsInfo(suitsMap);
      } catch {
        // Use fallback
      }
    };
    loadSuitsInfo();
  }, []);

  // Reset revealed positions when reading changes
  useEffect(() => {
    setRevealedPositions(new Set());
  }, [currentReading?.timestamp]);

  const handleSelectType = (type: ReadingType) => {
    setSelectedType(type);
  };

  const handleStartReading = () => {
    if (selectedType) {
      onStartReading(selectedType);
    }
  };

  const handleCardReveal = (drawnCard: DrawnCard) => {
    if (!revealedPositions.has(drawnCard.position)) {
      setRevealedPositions((prev) => new Set([...prev, drawnCard.position]));
      onRevealCard(drawnCard.position);
    } else {
      onCardClick(drawnCard.card, drawnCard.isReversed);
    }
  };

  const handleRevealAll = () => {
    if (currentReading) {
      const allPositions = new Set(currentReading.cards.map((c) => c.position));
      setRevealedPositions(allPositions);
    }
    onRevealAll();
  };

  const allRevealed = currentReading?.cards.every((c) => revealedPositions.has(c.position));
  const revealedCount = revealedPositions.size;

  const getSuitIcon = (suit?: TarotSuit): string => {
    if (!suit) return '★';
    if (suitsInfo[suit]) return '✨';
    return FALLBACK_SUIT_INFO[suit]?.icon || '★';
  };

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
    const spreadType = currentReading.spreadType as ReadingType;
    const info = getReadingTypeInfo(spreadType);

    return (
      <section className="draw-cards draw-cards--reading">
        <div className="draw-cards__reading-header">
          <h2 className="draw-cards__reading-title">{currentReading.spreadName || info.name}</h2>
          <span className="draw-cards__reading-progress">
            {revealedCount}/{currentReading.cards.length} reveladas
          </span>
        </div>

        {/* Cards Layout */}
        <div
          className={`draw-cards__layout draw-cards__layout--${currentReading.spreadType}`}
        >
          {currentReading.cards.map((drawnCard, index) => {
            const suit = drawnCard.card.suit || 'major';
            const gradient = getSuitGradient(suit);
            const isRevealed = revealedPositions.has(drawnCard.position);

            return (
              <div
                key={drawnCard.position}
                className={`draw-cards__position draw-cards__position--pos${drawnCard.position}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Position Label */}
                <div className="draw-cards__position-label">
                  <span className="draw-cards__position-name">{drawnCard.positionName}</span>
                </div>

                {/* Card */}
                <div
                  className={`draw-cards__card ${
                    isRevealed ? 'draw-cards__card--revealed' : ''
                  }`}
                  onClick={() => handleCardReveal(drawnCard)}
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
                  <div
                    className="draw-cards__card-front"
                    style={{
                      background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    }}
                  >
                    {drawnCard.card.number !== null && (
                      <div className="draw-cards__card-number">
                        {drawnCard.card.number}
                      </div>
                    )}
                    <div className="draw-cards__card-symbol">
                      {getSuitIcon(suit)}
                    </div>
                    <div className="draw-cards__card-name">
                      {drawnCard.card.name}
                    </div>
                    {drawnCard.isReversed && (
                      <div className="draw-cards__card-reversed">↓</div>
                    )}
                  </div>
                </div>

                {/* Position Description */}
                {isRevealed && (
                  <div className="draw-cards__position-desc">
                    {drawnCard.positionInterpretation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="draw-cards__actions">
          {!allRevealed && (
            <button className="draw-cards__action-btn" onClick={handleRevealAll}>
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
                <p>{currentReading.overallGuidance}</p>
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
