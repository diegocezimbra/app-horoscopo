/**
 * Dashboard Page
 * The "Hoje" (Today) screen - main daily engagement dashboard
 * Complete implementation with all cosmic sections
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { CosmicEvents } from '../../components/dashboard/CosmicEvents';
import type { TarotCard, Biorhythm, CosmicEnergy, MoonInfo, UserProfile } from '../../types/dashboard';
import './Dashboard.css';

// ============ MOCK DATA (for demonstration) ============
const mockTarotCard: TarotCard = {
  id: 'the-star',
  name: 'A Estrela',
  image: '/assets/tarot/the-star.jpg',
  message: 'Esperanca e renovacao iluminam seu caminho hoje. Confie no universo.',
  orientation: 'upright',
};

const mockBiorhythm: Biorhythm = {
  physical: 72,
  emotional: -35,
  intellectual: 88,
  date: new Date().toISOString(),
};

const mockCosmicEnergy: CosmicEnergy = {
  love: 78,
  work: 65,
  health: 82,
};

// ============ SUB-COMPONENTS ============

/**
 * Dashboard Header with personalized greeting, avatar, and streak
 */
interface DashboardHeaderProps {
  user: UserProfile;
  streak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, streak, timeOfDay }) => {
  const greetings = {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite',
    night: 'Boa noite',
  };

  const firstName = user.name.split(' ')[0];

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <div className="dashboard-header__avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} />
          ) : (
            <span className="dashboard-header__avatar-fallback">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="dashboard-header__greeting">
          <h1 className="dashboard-header__title">
            {greetings[timeOfDay]}, {firstName}!
          </h1>
          <p className="dashboard-header__subtitle">O universo conspira a seu favor</p>
        </div>
      </div>
      <div className="dashboard-header__streak">
        <span className="dashboard-header__streak-icon" aria-hidden="true">&#128293;</span>
        <span className="dashboard-header__streak-count">{streak}</span>
        <span className="dashboard-header__streak-label">dias</span>
      </div>
    </header>
  );
};

/**
 * Enhanced Horoscope Card with energy rating
 */
interface EnhancedHoroscopeCardProps {
  horoscope: {
    sign: string;
    signName: string;
    symbol: string;
    title: string;
    preview: string;
    fullText: string;
    energyRating?: number;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

const EnhancedHoroscopeCard: React.FC<EnhancedHoroscopeCardProps> = ({
  horoscope,
  isExpanded,
  onToggle,
}) => {
  const energyRating = horoscope.energyRating || 4;

  return (
    <div className="horoscope-enhanced">
      <div className="horoscope-enhanced__header">
        <span className="horoscope-enhanced__label">SEU HOROSCOPO DIARIO</span>
        <div className="horoscope-enhanced__rating" title={`Energia: ${energyRating}/5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`horoscope-enhanced__star ${i < energyRating ? 'horoscope-enhanced__star--filled' : ''}`}
              aria-hidden="true"
            >
              {i < energyRating ? '\u2605' : '\u2606'}
            </span>
          ))}
        </div>
      </div>

      <div className="horoscope-enhanced__sign">
        <span className="horoscope-enhanced__symbol" aria-hidden="true">
          {horoscope.symbol}
        </span>
        <span className="horoscope-enhanced__sign-name">{horoscope.signName}</span>
      </div>

      <h3 className="horoscope-enhanced__title">{horoscope.title}</h3>

      <div className="horoscope-enhanced__content">
        <p className="horoscope-enhanced__text">
          {isExpanded ? horoscope.fullText : `"${horoscope.preview}"`}
        </p>
      </div>

      <button
        className="horoscope-enhanced__toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Ler menos' : 'Ler mais'}</span>
        <svg
          className={`horoscope-enhanced__toggle-icon ${isExpanded ? 'horoscope-enhanced__toggle-icon--expanded' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className="horoscope-enhanced__stars-bg" aria-hidden="true">
        <span className="horoscope-enhanced__star-deco horoscope-enhanced__star-deco--1">&#10024;</span>
        <span className="horoscope-enhanced__star-deco horoscope-enhanced__star-deco--2">&#11088;</span>
        <span className="horoscope-enhanced__star-deco horoscope-enhanced__star-deco--3">&#10024;</span>
      </div>
    </div>
  );
};

/**
 * Cosmic Energy Bars Component
 */
interface CosmicEnergyBarsProps {
  energy: CosmicEnergy;
}

const CosmicEnergyBars: React.FC<CosmicEnergyBarsProps> = ({ energy }) => {
  const energyTypes = [
    { key: 'love', label: 'Amor', value: energy.love, color: '#ec4899', icon: '\u2764\uFE0F' },
    { key: 'work', label: 'Trabalho', value: energy.work, color: '#17A398', icon: '\uD83D\uDCBC' },
    { key: 'health', label: 'Saude', value: energy.health, color: '#22c55e', icon: '\uD83D\uDC9A' },
  ];

  return (
    <div className="cosmic-energy">
      <div className="cosmic-energy__header">
        <span className="cosmic-energy__icon" aria-hidden="true">&#10024;</span>
        <h3 className="cosmic-energy__title">Energia Cosmica</h3>
      </div>

      <div className="cosmic-energy__bars">
        {energyTypes.map((type, index) => (
          <div
            key={type.key}
            className="cosmic-energy__bar-item"
            style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
          >
            <div className="cosmic-energy__bar-header">
              <span className="cosmic-energy__bar-icon" aria-hidden="true">{type.icon}</span>
              <span className="cosmic-energy__bar-label">{type.label}</span>
              <span className="cosmic-energy__bar-value">{type.value}%</span>
            </div>
            <div className="cosmic-energy__bar-track">
              <div
                className="cosmic-energy__bar-fill"
                style={{
                  '--fill-width': `${type.value}%`,
                  '--bar-color': type.color,
                } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={type.value}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Tarot Card of the Day Component
 */
interface TarotCardDisplayProps {
  card: TarotCard;
  onViewDetails?: () => void;
}

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({ card, onViewDetails }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate('/tarot');
    }
  };

  return (
    <div className="tarot-card">
      <div className="tarot-card__header">
        <span className="tarot-card__icon" aria-hidden="true">&#127183;</span>
        <h3 className="tarot-card__title">Carta do Dia</h3>
      </div>

      <div className="tarot-card__content">
        <div className="tarot-card__visual">
          <div className={`tarot-card__image ${card.orientation === 'reversed' ? 'tarot-card__image--reversed' : ''}`}>
            <div className="tarot-card__image-inner">
              <span className="tarot-card__image-symbol" aria-hidden="true">&#11088;</span>
            </div>
          </div>
          <div className="tarot-card__glow" aria-hidden="true" />
        </div>

        <div className="tarot-card__info">
          <h4 className="tarot-card__name">{card.name}</h4>
          {card.orientation === 'reversed' && (
            <span className="tarot-card__orientation">(Invertida)</span>
          )}
          <p className="tarot-card__message">{card.message}</p>
        </div>
      </div>

      <button className="tarot-card__button" onClick={handleClick}>
        <span>Ver detalhes</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

/**
 * Moon Phase Component
 */
interface MoonPhaseDisplayProps {
  moon: MoonInfo;
}

const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({ moon }) => {
  const moonPhaseIcons: Record<string, string> = {
    'new-moon': '\uD83C\uDF11',
    'waxing-crescent': '\uD83C\uDF12',
    'first-quarter': '\uD83C\uDF13',
    'waxing-gibbous': '\uD83C\uDF14',
    'full-moon': '\uD83C\uDF15',
    'waning-gibbous': '\uD83C\uDF16',
    'last-quarter': '\uD83C\uDF17',
    'waning-crescent': '\uD83C\uDF18',
  };

  const moonPhaseNames: Record<string, string> = {
    'new-moon': 'Lua Nova',
    'waxing-crescent': 'Lua Crescente',
    'first-quarter': 'Quarto Crescente',
    'waxing-gibbous': 'Gibosa Crescente',
    'full-moon': 'Lua Cheia',
    'waning-gibbous': 'Gibosa Minguante',
    'last-quarter': 'Quarto Minguante',
    'waning-crescent': 'Lua Minguante',
  };

  const moonTips: Record<string, string> = {
    'new-moon': 'Momento ideal para novos comecos e intencoes.',
    'waxing-crescent': 'Fase de crescimento. Plante suas sementes.',
    'first-quarter': 'Hora de agir e tomar decisoes.',
    'waxing-gibbous': 'Refine seus planos e ajuste o curso.',
    'full-moon': 'Culminacao de energias. Celebre conquistas.',
    'waning-gibbous': 'Compartilhe sabedoria e conhecimento.',
    'last-quarter': 'Libere o que nao serve mais.',
    'waning-crescent': 'Descanse e prepare-se para o novo ciclo.',
  };

  const icon = moonPhaseIcons[moon.phase] || '\uD83C\uDF19';
  const phaseName = moonPhaseNames[moon.phase] || 'Lua';
  const tip = moonTips[moon.phase] || moon.description;

  return (
    <div className="moon-phase">
      <div className="moon-phase__visual">
        <span className="moon-phase__icon" aria-hidden="true">{icon}</span>
        <div className="moon-phase__glow" aria-hidden="true" />
      </div>

      <div className="moon-phase__content">
        <h3 className="moon-phase__title">{phaseName}</h3>
        <p className="moon-phase__sign">Lua em {moon.signName}</p>
        <p className="moon-phase__tip">{tip}</p>
      </div>
    </div>
  );
};

/**
 * Biorhythm Display Component
 */
interface BiorhythmDisplayProps {
  biorhythm: Biorhythm;
}

const BiorhythmDisplay: React.FC<BiorhythmDisplayProps> = ({ biorhythm }) => {
  const getBiorhythmStatus = (value: number): { label: string; color: string } => {
    if (value > 50) return { label: 'Alto', color: '#22c55e' };
    if (value > 0) return { label: 'Positivo', color: '#84cc16' };
    if (value > -50) return { label: 'Baixo', color: '#f59e0b' };
    return { label: 'Critico', color: '#ef4444' };
  };

  const rhythms = [
    { key: 'physical', label: 'Fisico', value: biorhythm.physical, icon: '\uD83C\uDFCB\uFE0F' },
    { key: 'emotional', label: 'Emocional', value: biorhythm.emotional, icon: '\u2764\uFE0F' },
    { key: 'intellectual', label: 'Intelectual', value: biorhythm.intellectual, icon: '\uD83E\uDDE0' },
  ];

  return (
    <div className="biorhythm">
      <div className="biorhythm__header">
        <span className="biorhythm__icon" aria-hidden="true">&#128200;</span>
        <h3 className="biorhythm__title">Biorritmos</h3>
      </div>

      <div className="biorhythm__grid">
        {rhythms.map((rhythm) => {
          const status = getBiorhythmStatus(rhythm.value);
          const normalizedValue = ((rhythm.value + 100) / 200) * 100;

          return (
            <div key={rhythm.key} className="biorhythm__item">
              <div className="biorhythm__item-header">
                <span className="biorhythm__item-icon" aria-hidden="true">{rhythm.icon}</span>
                <span className="biorhythm__item-label">{rhythm.label}</span>
              </div>

              <div className="biorhythm__meter">
                <div className="biorhythm__meter-track">
                  <div className="biorhythm__meter-center" aria-hidden="true" />
                  <div
                    className="biorhythm__meter-fill"
                    style={{
                      '--fill-position': `${normalizedValue}%`,
                      '--fill-color': status.color,
                    } as React.CSSProperties}
                  />
                  <div
                    className="biorhythm__meter-indicator"
                    style={{
                      '--indicator-position': `${normalizedValue}%`,
                      '--indicator-color': status.color,
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="biorhythm__item-footer">
                <span
                  className="biorhythm__item-status"
                  style={{ color: status.color }}
                >
                  {status.label}
                </span>
                <span className="biorhythm__item-value">{rhythm.value}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Enhanced Lucky Numbers with zodiac colors
 */
interface ZodiacLuckyNumbersProps {
  numbers: number[];
  signColor: string;
  onRegenerate: () => Promise<any>;
}

const ZodiacLuckyNumbers: React.FC<ZodiacLuckyNumbersProps> = ({
  numbers,
  signColor,
  onRegenerate,
}) => {
  const [isRegenerating, setIsRegenerating] = React.useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await onRegenerate();
    setIsRegenerating(false);
  };

  return (
    <div className="zodiac-lucky-numbers">
      <div className="zodiac-lucky-numbers__header">
        <span className="zodiac-lucky-numbers__icon" aria-hidden="true">&#127942;</span>
        <h3 className="zodiac-lucky-numbers__title">Numeros da Sorte</h3>
      </div>

      <div className={`zodiac-lucky-numbers__display ${isRegenerating ? 'zodiac-lucky-numbers__display--regenerating' : ''}`}>
        {numbers.map((num, index) => (
          <div
            key={index}
            className="zodiac-lucky-numbers__number"
            style={{
              '--delay': `${index * 0.1}s`,
              '--glow-color': signColor,
            } as React.CSSProperties}
          >
            {num}
          </div>
        ))}
      </div>

      <button
        className="zodiac-lucky-numbers__regenerate"
        onClick={handleRegenerate}
        disabled={isRegenerating}
      >
        <svg
          className={`zodiac-lucky-numbers__regenerate-icon ${isRegenerating ? 'zodiac-lucky-numbers__regenerate-icon--spinning' : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>Gerar novos</span>
      </button>
    </div>
  );
};

/**
 * Quick Actions Grid
 */
const EnhancedQuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { id: 'compatibility', label: 'Compatibilidade', icon: '\uD83D\uDC95', route: '/compatibility', color: 'pink' },
    { id: 'tarot', label: 'Taro', icon: '\uD83C\uDCCF', route: '/tarot', color: 'purple' },
    { id: 'profiles', label: 'Perfis', icon: '\uD83D\uDC64', route: '/profiles', color: 'blue' },
    { id: 'premium', label: 'Premium', icon: '\uD83D\uDC8E', route: '/premium', color: 'gold' },
  ];

  return (
    <div className="enhanced-quick-actions">
      <div className="enhanced-quick-actions__header">
        <span className="enhanced-quick-actions__icon" aria-hidden="true">&#9889;</span>
        <h3 className="enhanced-quick-actions__title">Acoes Rapidas</h3>
      </div>

      <div className="enhanced-quick-actions__grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`enhanced-quick-actions__button enhanced-quick-actions__button--${action.color}`}
            onClick={() => navigate(action.route)}
          >
            <span className="enhanced-quick-actions__button-icon" aria-hidden="true">
              {action.icon}
            </span>
            <span className="enhanced-quick-actions__button-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============ MAIN DASHBOARD COMPONENT ============

export const Dashboard: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    isHoroscopeExpanded,
    toggleHoroscope,
    regenerateLuckyNumbers,
    refresh,
  } = useDashboard();

  // Get zodiac sign color
  const signColors: Record<string, string> = {
    aries: '#ef4444',
    taurus: '#22c55e',
    gemini: '#fbbf24',
    cancer: '#c084fc',
    leo: '#f97316',
    virgo: '#84cc16',
    libra: '#ec4899',
    scorpio: '#dc2626',
    sagittarius: '#8b5cf6',
    capricorn: '#6b7280',
    aquarius: '#06b6d4',
    pisces: '#3b82f6',
  };

  const signColor = useMemo(() => {
    if (!data?.user?.sunSign) return '#17A398';
    return signColors[data.user.sunSign] || '#17A398';
  }, [data?.user?.sunSign]);

  // Loading state
  if (isLoading) {
    return (
      <div className="dashboard dashboard--loading">
        <div className="dashboard__loader">
          <div className="dashboard__loader-orbit">
            <div className="dashboard__loader-planet" />
          </div>
          <span className="dashboard__loader-text">Consultando os astros...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard dashboard--error">
        <div className="dashboard__error">
          <span className="dashboard__error-icon" aria-hidden="true">&#127756;</span>
          <h2 className="dashboard__error-title">Ops! Algo deu errado</h2>
          <p className="dashboard__error-message">{error}</p>
          <button className="dashboard__error-button" onClick={refresh}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Use mock data for features not yet in API
  const tarotCard = data.tarotCard || mockTarotCard;
  const biorhythm = data.biorhythm || mockBiorhythm;
  const cosmicEnergy = data.cosmicEnergy || mockCosmicEnergy;

  return (
    <div className="dashboard">
      {/* Animated background */}
      <div className="dashboard__background" aria-hidden="true">
        <div className="dashboard__stars">
          {Array.from({ length: 30 }, (_, i) => (
            <span
              key={i}
              className="dashboard__star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>
        <div className="dashboard__nebula dashboard__nebula--1" />
        <div className="dashboard__nebula dashboard__nebula--2" />
      </div>

      <div className="dashboard__container">
        {/* 1. Header personalizado */}
        <section className="dashboard__section dashboard__section--header" aria-label="Cabecalho">
          <DashboardHeader
            user={data.user}
            streak={data.streak.currentStreak}
            timeOfDay={data.greeting.timeOfDay}
          />
        </section>

        {/* 2. Card de Horoscopo do Dia */}
        <section className="dashboard__section" aria-label="Horoscopo diario">
          <EnhancedHoroscopeCard
            horoscope={{
              ...data.horoscope,
              energyRating: data.horoscope.energyRating || 4,
            }}
            isExpanded={isHoroscopeExpanded}
            onToggle={toggleHoroscope}
          />
        </section>

        {/* 3. Energia Cosmica */}
        <section className="dashboard__section" aria-label="Energia cosmica">
          <CosmicEnergyBars energy={cosmicEnergy} />
        </section>

        {/* 4. Carta do Dia (Taro) */}
        <section className="dashboard__section" aria-label="Carta do taro">
          <TarotCardDisplay card={tarotCard} />
        </section>

        {/* 5. Fase Lunar Atual */}
        <section className="dashboard__section" aria-label="Fase lunar">
          <MoonPhaseDisplay moon={data.moon} />
        </section>

        {/* 6. Numeros da Sorte */}
        <section className="dashboard__section" aria-label="Numeros da sorte">
          <ZodiacLuckyNumbers
            numbers={data.luckyNumbers.numbers}
            signColor={signColor}
            onRegenerate={regenerateLuckyNumbers}
          />
        </section>

        {/* 7. Biorritmos */}
        <section className="dashboard__section" aria-label="Biorritmos">
          <BiorhythmDisplay biorhythm={biorhythm} />
        </section>

        {/* 8. Eventos Cosmicos */}
        <section className="dashboard__section" aria-label="Eventos cosmicos">
          <CosmicEvents events={data.cosmicEvents} />
        </section>

        {/* 9. Acoes Rapidas */}
        <section className="dashboard__section" aria-label="Acoes rapidas">
          <EnhancedQuickActions />
        </section>

        {/* Footer spacing */}
        <div className="dashboard__footer-spacer" />
      </div>
    </div>
  );
};

export default Dashboard;
