/**
 * LuckyNumbers Component
 * Displays lucky numbers with regenerate and share options
 */

import React, { useState } from 'react';
import type { LuckyNumbersData } from '../../../types/dashboard';
import './LuckyNumbers.css';

interface LuckyNumbersProps {
  luckyNumbers: LuckyNumbersData;
  onRegenerate: () => Promise<LuckyNumbersData | null>;
}

export const LuckyNumbers: React.FC<LuckyNumbersProps> = ({
  luckyNumbers,
  onRegenerate,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await onRegenerate();
    setIsRegenerating(false);
  };

  const handleShare = async () => {
    const text = `Meus numeros da sorte de hoje: ${luckyNumbers.numbers.join(' - ')} \u2728\nDescubra os seus em [App Horoscopo]`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Numeros da Sorte',
          text,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      } catch {
        // Clipboard not available
      }
    }
  };

  return (
    <div className="lucky-numbers">
      <div className="lucky-numbers__header">
        <span className="lucky-numbers__icon" aria-hidden="true">\uD83C\uDF1F</span>
        <h3 className="lucky-numbers__title">Seus Numeros da Sorte</h3>
      </div>

      <div className={`lucky-numbers__display ${isRegenerating ? 'lucky-numbers__display--regenerating' : ''}`}>
        {luckyNumbers.numbers.map((num, index) => (
          <React.Fragment key={index}>
            <span className="lucky-numbers__number" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
              {num}
            </span>
            {index < luckyNumbers.numbers.length - 1 && (
              <span className="lucky-numbers__separator" aria-hidden="true">\u2022</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="lucky-numbers__actions">
        <button
          className="lucky-numbers__button lucky-numbers__button--regenerate"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          aria-label="Gerar novos numeros"
        >
          <svg
            className={`lucky-numbers__button-icon ${isRegenerating ? 'lucky-numbers__button-icon--spinning' : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Gerar novos</span>
        </button>

        <button
          className="lucky-numbers__button lucky-numbers__button--share"
          onClick={handleShare}
          aria-label="Compartilhar numeros"
        >
          <svg
            className="lucky-numbers__button-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Compartilhar</span>
        </button>
      </div>

      {/* Toast notification */}
      {showShareToast && (
        <div className="lucky-numbers__toast" role="alert">
          Copiado para a area de transferencia!
        </div>
      )}
    </div>
  );
};

export default LuckyNumbers;
