/**
 * ShareCard Component
 * Beautiful shareable card for Instagram Stories
 */

import React, { useRef, useCallback } from 'react';
import { CompatibilityResult, ZODIAC_SIGNS, ZodiacSignId } from '../../../types/profiles';
import './ShareCard.css';

export interface ShareCardProps {
  result: CompatibilityResult;
  onShare?: () => void;
  onDownload?: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({
  result,
  onShare,
  onDownload,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getName = (profile: typeof result.profile1): string => {
    if ('name' in profile) return profile.name;
    return 'Perfil';
  };

  const getSign = (profile: typeof result.profile1): ZodiacSignId => {
    if ('sunSign' in profile) return profile.sunSign;
    return profile.sign;
  };

  const name1 = getName(result.profile1);
  const name2 = getName(result.profile2);
  const sign1 = ZODIAC_SIGNS[getSign(result.profile1)];
  const sign2 = ZODIAC_SIGNS[getSign(result.profile2)];

  const getScoreEmoji = (score: number): string => {
    if (score >= 90) return '\uD83D\uDC96';
    if (score >= 80) return '\u2764\uFE0F';
    if (score >= 70) return '\uD83E\uDDE1';
    if (score >= 60) return '\uD83D\uDC9B';
    if (score >= 50) return '\uD83D\uDC9A';
    return '\uD83D\uDC99';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Almas Gemeas!';
    if (score >= 80) return 'Match Perfeito!';
    if (score >= 70) return 'Combinacao Incrivel!';
    if (score >= 60) return 'Bom Potencial!';
    if (score >= 50) return 'Interessante...';
    return 'Desafiador';
  };

  const getGradientByScore = (score: number): string => {
    if (score >= 80) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)';
    }
    if (score >= 60) {
      return 'linear-gradient(135deg, #6B46C1 0%, #805AD5 50%, #B794F4 100%)';
    }
    return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `compatibilidade-${name1}-${name2}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      onDownload?.();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }, [name1, name2, onDownload]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Compatibilidade: ${name1} e ${name2}`,
          text: `${name1} (${sign1.name}) e ${name2} (${sign2.name}) tem ${result.overallScore}% de compatibilidade! Descubra a sua no app Horoscopo.`,
          url: window.location.href,
        });
        onShare?.();
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${name1} (${sign1.name}) e ${name2} (${sign2.name}) tem ${result.overallScore}% de compatibilidade! Descubra a sua no app Horoscopo.`;
      await navigator.clipboard.writeText(text);
      alert('Link copiado!');
      onShare?.();
    }
  }, [name1, name2, sign1.name, sign2.name, result.overallScore, onShare]);

  return (
    <div className="share-card-wrapper">
      <div
        ref={cardRef}
        className="share-card"
        style={{ background: getGradientByScore(result.overallScore) }}
      >
        {/* Stars decoration */}
        <div className="share-card__stars">
          <span className="share-card__star share-card__star--1">\u2728</span>
          <span className="share-card__star share-card__star--2">\u2B50</span>
          <span className="share-card__star share-card__star--3">\u2728</span>
          <span className="share-card__star share-card__star--4">\u2B50</span>
        </div>

        {/* Header */}
        <div className="share-card__header">
          <span className="share-card__app-name">Horoscopo App</span>
          <span className="share-card__subtitle">Compatibilidade Astral</span>
        </div>

        {/* Profiles */}
        <div className="share-card__profiles">
          <div className="share-card__profile">
            <div className="share-card__sign-emoji">{sign1.emoji}</div>
            <span className="share-card__name">{name1}</span>
            <span className="share-card__sign-name">{sign1.name}</span>
          </div>

          <div className="share-card__heart">
            {getScoreEmoji(result.overallScore)}
          </div>

          <div className="share-card__profile">
            <div className="share-card__sign-emoji">{sign2.emoji}</div>
            <span className="share-card__name">{name2}</span>
            <span className="share-card__sign-name">{sign2.name}</span>
          </div>
        </div>

        {/* Score */}
        <div className="share-card__score-container">
          <div className="share-card__score-circle">
            <span className="share-card__score">{result.overallScore}%</span>
          </div>
          <span className="share-card__score-message">
            {getScoreMessage(result.overallScore)}
          </span>
        </div>

        {/* Categories preview */}
        <div className="share-card__categories">
          {result.categories.slice(0, 3).map((cat) => (
            <div key={cat.id} className="share-card__category">
              <span className="share-card__category-icon">{cat.icon}</span>
              <span className="share-card__category-score">{cat.score}%</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="share-card__footer">
          <span className="share-card__cta">Descubra sua compatibilidade!</span>
          <span className="share-card__url">horoscopo.app</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="share-card__actions">
        <button
          className="share-card__action share-card__action--download"
          onClick={handleDownload}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Salvar Imagem
        </button>
        <button
          className="share-card__action share-card__action--share"
          onClick={handleShare}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartilhar
        </button>
      </div>
    </div>
  );
};

export default ShareCard;
