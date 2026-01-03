/**
 * Tarot Home Page
 * Main tarot page with daily card, reading options and history
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../../hooks/useTarot';
import { DailyCard } from './DailyCard';
import { DrawCards } from './DrawCards';
import { CardDetail } from './CardDetail';
import { ReadingType, TarotCard, TarotSuit } from '../../services/tarot.service';
import './Tarot.css';

type TabType = 'daily' | 'draw' | 'history';

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

export const TarotHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    dailyCard,
    currentReading,
    recentReadings,
    isLoading,
    isShuffling,
    startReading,
    revealCard,
    revealAllCards,
    clearCurrentReading,
    startShuffle,
    stopShuffle,
    getReadingTypeInfo,
  } = useTarot();

  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [selectedIsReversed, setSelectedIsReversed] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);

  const handleStartReading = (type: ReadingType) => {
    startShuffle();
    // Simulate shuffle animation
    setTimeout(() => {
      startReading(type);
      stopShuffle();
    }, 2000);
  };

  const handleCardClick = (card: TarotCard, isReversed = false) => {
    setSelectedCard(card);
    setSelectedIsReversed(isReversed);
    setShowCardDetail(true);
  };

  const handleCloseCardDetail = () => {
    setShowCardDetail(false);
    setSelectedCard(null);
    setSelectedIsReversed(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !dailyCard) {
    return (
      <div className="tarot-page">
        <div className="tarot-page__loading">
          <div className="tarot-page__loading-card">
            <div className="tarot-page__loading-glow" />
          </div>
          <p>Consultando os arcanos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tarot-page">
      {/* Starry Background */}
      <div className="tarot-page__stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="tarot-page__star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="tarot-page__header">
        <button className="tarot-page__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="tarot-page__title">Taro Mistico</h1>
        <div className="tarot-page__spacer" />
      </header>

      {/* Tab Navigation */}
      <nav className="tarot-page__tabs">
        <button
          className={`tarot-page__tab ${activeTab === 'daily' ? 'tarot-page__tab--active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          <span className="tarot-page__tab-icon">☀️</span>
          <span>Carta do Dia</span>
        </button>
        <button
          className={`tarot-page__tab ${activeTab === 'draw' ? 'tarot-page__tab--active' : ''}`}
          onClick={() => setActiveTab('draw')}
        >
          <span className="tarot-page__tab-icon">🎴</span>
          <span>Tiragem</span>
        </button>
        <button
          className={`tarot-page__tab ${activeTab === 'history' ? 'tarot-page__tab--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="tarot-page__tab-icon">📜</span>
          <span>Historico</span>
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tarot-page__content">
        {/* Daily Card Tab */}
        {activeTab === 'daily' && dailyCard && (
          <DailyCard
            dailyCard={dailyCard}
            onCardClick={() => handleCardClick(dailyCard.card, dailyCard.isReversed)}
          />
        )}

        {/* Draw Cards Tab */}
        {activeTab === 'draw' && (
          <DrawCards
            currentReading={currentReading}
            isShuffling={isShuffling}
            onStartReading={handleStartReading}
            onRevealCard={revealCard}
            onRevealAll={revealAllCards}
            onClearReading={clearCurrentReading}
            onCardClick={handleCardClick}
            getReadingTypeInfo={getReadingTypeInfo}
          />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <section className="tarot-history">
            <h2 className="tarot-history__title">
              <span>📜</span> Tiragens Recentes
            </h2>

            {recentReadings.length === 0 ? (
              <div className="tarot-history__empty">
                <div className="tarot-history__empty-icon">🔮</div>
                <p>Nenhuma tiragem realizada ainda</p>
                <button
                  className="tarot-history__empty-btn"
                  onClick={() => setActiveTab('draw')}
                >
                  Fazer uma tiragem
                </button>
              </div>
            ) : (
              <div className="tarot-history__list">
                {recentReadings.map((reading) => {
                  const spreadType = reading.spreadType as ReadingType;
                  const info = getReadingTypeInfo(spreadType);
                  return (
                    <div key={reading.timestamp} className="tarot-history__item">
                      <div className="tarot-history__item-header">
                        <span className="tarot-history__item-type">{reading.spreadName || info.name}</span>
                        <span className="tarot-history__item-date">
                          {formatDate(reading.timestamp)}
                        </span>
                      </div>
                      <div className="tarot-history__item-cards">
                        {reading.cards.slice(0, 3).map((drawnCard) => {
                          const suit = drawnCard.card.suit || 'major';
                          const gradient = getSuitGradient(suit);
                          return (
                            <div
                              key={drawnCard.position}
                              className="tarot-history__mini-card"
                              style={{
                                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                              }}
                            >
                              {drawnCard.card.number !== null && (
                                <span className="tarot-history__mini-number">
                                  {drawnCard.card.number}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {reading.cards.length > 3 && (
                          <span className="tarot-history__more">
                            +{reading.cards.length - 3}
                          </span>
                        )}
                      </div>
                      <p className="tarot-history__item-interpretation">
                        {reading.overallGuidance.substring(0, 100)}...
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Card Detail Modal */}
      {showCardDetail && selectedCard && (
        <CardDetail
          card={selectedCard}
          isReversed={selectedIsReversed}
          onClose={handleCloseCardDetail}
        />
      )}
    </div>
  );
};

export default TarotHome;
