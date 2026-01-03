/**
 * useTarot Hook
 * Manages tarot readings and daily card state via backend API
 */

import { useState, useEffect, useCallback } from 'react';
import {
  TarotReading,
  DailyCard,
  ReadingType,
  tarotService,
} from '../services/tarot.service';

const READINGS_HISTORY_KEY = 'horoscope_tarot_readings';
const MAX_READINGS = 10;

export interface TarotState {
  dailyCard: DailyCard | null;
  currentReading: TarotReading | null;
  recentReadings: TarotReading[];
  isLoading: boolean;
  isShuffling: boolean;
  error: string | null;
}

export interface UseTarotReturn extends TarotState {
  loadDailyCard: () => Promise<void>;
  startReading: (type: ReadingType, question?: string) => Promise<TarotReading>;
  revealCard: (position: number) => void;
  revealAllCards: () => void;
  clearCurrentReading: () => void;
  startShuffle: () => void;
  stopShuffle: () => void;
  loadRecentReadings: () => void;
  clearHistory: () => void;
  getReadingTypeInfo: (type: ReadingType) => { name: string; description: string; cardCount: number };
}

const getStoredReadings = (): TarotReading[] => {
  try {
    const stored = localStorage.getItem(READINGS_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReading = (reading: TarotReading): void => {
  try {
    const readings = getStoredReadings();
    const updated = [reading, ...readings].slice(0, MAX_READINGS);
    localStorage.setItem(READINGS_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

const clearStoredReadings = (): void => {
  localStorage.removeItem(READINGS_HISTORY_KEY);
};

const READING_TYPE_INFO: Record<ReadingType, { name: string; description: string; cardCount: number }> = {
  single: {
    name: 'Carta Unica',
    description: 'Uma carta para uma resposta direta',
    cardCount: 1,
  },
  'past-present-future': {
    name: 'Passado, Presente e Futuro',
    description: 'Tres cartas para ver sua jornada',
    cardCount: 3,
  },
  'celtic-cross': {
    name: 'Cruz Celta',
    description: 'Leitura completa e detalhada',
    cardCount: 10,
  },
};

export const useTarot = (): UseTarotReturn => {
  const [state, setState] = useState<TarotState>({
    dailyCard: null,
    currentReading: null,
    recentReadings: [],
    isLoading: true,
    isShuffling: false,
    error: null,
  });

  const loadDailyCard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const dailyCard = await tarotService.getDailyCard();
      setState((prev) => ({
        ...prev,
        dailyCard,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar carta do dia',
      }));
    }
  }, []);

  const loadRecentReadings = useCallback(() => {
    try {
      const recentReadings = getStoredReadings();
      setState((prev) => ({
        ...prev,
        recentReadings,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Erro ao carregar historico',
      }));
    }
  }, []);

  useEffect(() => {
    loadDailyCard();
    loadRecentReadings();
  }, [loadDailyCard, loadRecentReadings]);

  const startReading = useCallback(async (type: ReadingType, question?: string): Promise<TarotReading> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, isShuffling: false }));

    try {
      const cardCount = READING_TYPE_INFO[type].cardCount as 1 | 3 | 10;
      const reading = await tarotService.drawCards({
        numberOfCards: cardCount,
        spreadType: type,
        includeReversed: true,
        question,
      });

      saveReading(reading);

      setState((prev) => ({
        ...prev,
        currentReading: reading,
        recentReadings: getStoredReadings(),
        isLoading: false,
        isShuffling: false,
        error: null,
      }));
      return reading;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isShuffling: false,
        error: err instanceof Error ? err.message : 'Erro ao criar tiragem',
      }));
      throw err;
    }
  }, []);

  const revealCard = useCallback((position: number) => {
    setState((prev) => {
      if (!prev.currentReading) return prev;

      const updatedCards = prev.currentReading.cards.map((card) =>
        card.position === position ? { ...card, isRevealed: true } : card
      );

      return {
        ...prev,
        currentReading: {
          ...prev.currentReading,
          cards: updatedCards,
        },
      };
    });
  }, []);

  const revealAllCards = useCallback(() => {
    setState((prev) => {
      if (!prev.currentReading) return prev;

      const updatedCards = prev.currentReading.cards.map((card) => ({
        ...card,
        isRevealed: true,
      }));

      return {
        ...prev,
        currentReading: {
          ...prev.currentReading,
          cards: updatedCards,
        },
      };
    });
  }, []);

  const clearCurrentReading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentReading: null,
    }));
  }, []);

  const startShuffle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isShuffling: true,
    }));
  }, []);

  const stopShuffle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isShuffling: false,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    clearStoredReadings();
    setState((prev) => ({
      ...prev,
      recentReadings: [],
    }));
  }, []);

  const getReadingTypeInfo = useCallback(
    (type: ReadingType) => READING_TYPE_INFO[type],
    []
  );

  return {
    ...state,
    loadDailyCard,
    startReading,
    revealCard,
    revealAllCards,
    clearCurrentReading,
    startShuffle,
    stopShuffle,
    loadRecentReadings,
    clearHistory,
    getReadingTypeInfo,
  };
};

export default useTarot;
