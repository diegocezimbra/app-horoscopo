/**
 * StreakCounter Component
 * Displays user's daily visit streak with fire animation
 */

import React, { useEffect, useState } from 'react';
import type { StreakInfo } from '../../../types/dashboard';
import './StreakCounter.css';

interface StreakCounterProps {
  streak: StreakInfo;
}

const motivationalMessages: Record<number, string> = {
  1: 'Primeiro dia! O inicio de uma jornada.',
  2: 'Dois dias seguidos! Continue assim!',
  3: 'Tres dias! Voce esta criando um habito.',
  4: 'Quatro dias! Sua consistencia e inspiradora.',
  5: 'Cinco dias! Uma semana de trabalho completa!',
  7: 'Uma semana inteira! Voce e incrivel!',
  14: 'Duas semanas! Voce e uma estrela!',
  21: 'Tres semanas! Um novo habito formado!',
  30: 'Um mes inteiro! Voce e lendario!',
  50: 'Cinquenta dias! Mestre da consistencia!',
  100: 'CEM DIAS! Voce e uma forca da natureza!',
};

function getMotivationalMessage(streak: number): string {
  // Check for exact match first
  if (motivationalMessages[streak]) {
    return motivationalMessages[streak];
  }

  // Otherwise, return a generic message based on streak level
  if (streak >= 100) return 'Incrivel! Continue brilhando!';
  if (streak >= 50) return 'Impressionante dedicacao!';
  if (streak >= 30) return 'Um mes de magia!';
  if (streak >= 21) return 'Habito consolidado!';
  if (streak >= 14) return 'Duas semanas de energia!';
  if (streak >= 7) return 'Uma semana completa!';
  if (streak >= 3) return 'Continue voltando!';
  return 'Continue voltando!';
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const message = streak.milestoneMessage || getMotivationalMessage(streak.currentStreak);

  useEffect(() => {
    if (streak.isMilestone) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streak.isMilestone]);

  return (
    <div className={`streak-counter ${showCelebration ? 'streak-counter--celebrating' : ''}`}>
      <div className="streak-counter__content">
        <div className="streak-counter__icon-wrapper">
          <span className="streak-counter__icon" aria-hidden="true">\uD83D\uDD25</span>
          {streak.currentStreak >= 7 && (
            <span className="streak-counter__badge" aria-hidden="true">\u2B50</span>
          )}
        </div>

        <div className="streak-counter__info">
          <div className="streak-counter__count">
            <span className="streak-counter__number">{streak.currentStreak}</span>
            <span className="streak-counter__label">
              {streak.currentStreak === 1 ? 'dia' : 'dias'}
            </span>
          </div>
          <p className="streak-counter__message">{message}</p>
        </div>
      </div>

      {/* Celebration particles */}
      {showCelebration && (
        <div className="streak-counter__celebration" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="streak-counter__particle"
              style={{
                '--delay': `${i * 0.1}s`,
                '--angle': `${i * 30}deg`,
              } as React.CSSProperties}
            >
              {['\u2728', '\u2B50', '\uD83C\uDF1F', '\uD83D\uDCAB'][i % 4]}
            </span>
          ))}
        </div>
      )}

      {/* Best streak info */}
      {streak.longestStreak > streak.currentStreak && (
        <div className="streak-counter__best">
          Recorde: {streak.longestStreak} dias
        </div>
      )}
    </div>
  );
};

export default StreakCounter;
