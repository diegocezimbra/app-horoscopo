/**
 * useTarot Hook
 * Manages tarot readings and daily card state
 */

import { useState, useEffect, useCallback } from 'react';
import {
  TarotState,
  TarotReading,
  ReadingType,
  tarotService,
} from '../services/tarot.service';

export interface UseTarotReturn extends TarotState {
  // Daily card actions
  loadDailyCard: () => void;

  // Reading actions
  startReading: (type: ReadingType) => TarotReading;
  revealCard: (positionId: string) => void;
  revealAllCards: () => void;
  clearCurrentReading: () => void;

  // Shuffle animation
  startShuffle: () => void;
  stopShuffle: () => void;

  // History actions
  loadRecentReadings: () => void;
  clearHistory: () => void;

  // Utility
  getReadingTypeInfo: (type: ReadingType) => { name: string; description: string; cardCount: number };
}

export const useTarot = (): UseTarotReturn => {
  const [state, setState] = useState<TarotState>({
    dailyCard: null,
    currentReading: null,
    recentReadings: [],
    isLoading: true,
    isShuffling: false,
    error: null,
  });

  // Load initial data
  const loadDailyCard = useCallback(() => {
    try {
      const dailyCard = tarotService.getOrGenerateDailyCard();
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
        error: 'Erro ao carregar carta do dia',
      }));
    }
  }, []);

  const loadRecentReadings = useCallback(() => {
    try {
      const recentReadings = tarotService.getRecentReadings();
      setState((prev) => ({
        ...prev,
        recentReadings,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar historico',
      }));
    }
  }, []);

  useEffect(() => {
    loadDailyCard();
    loadRecentReadings();
  }, [loadDailyCard, loadRecentReadings]);

  // Start a new reading
  const startReading = useCallback((type: ReadingType): TarotReading => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const reading = tarotService.createReading(type);
      setState((prev) => ({
        ...prev,
        currentReading: reading,
        recentReadings: tarotService.getRecentReadings(),
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
        error: 'Erro ao criar tiragem',
      }));
      throw err;
    }
  }, []);

  // Reveal a single card
  const revealCard = useCallback((positionId: string) => {
    setState((prev) => {
      if (!prev.currentReading) return prev;

      const updatedPositions = prev.currentReading.positions.map((pos) =>
        pos.id === positionId ? { ...pos, isRevealed: true } : pos
      );

      return {
        ...prev,
        currentReading: {
          ...prev.currentReading,
          positions: updatedPositions,
        },
      };
    });
  }, []);

  // Reveal all cards at once
  const revealAllCards = useCallback(() => {
    setState((prev) => {
      if (!prev.currentReading) return prev;

      const updatedPositions = prev.currentReading.positions.map((pos) => ({
        ...pos,
        isRevealed: true,
      }));

      return {
        ...prev,
        currentReading: {
          ...prev.currentReading,
          positions: updatedPositions,
        },
      };
    });
  }, []);

  // Clear current reading
  const clearCurrentReading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentReading: null,
    }));
  }, []);

  // Shuffle animation controls
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

  // Clear history
  const clearHistory = useCallback(() => {
    tarotService.clearReadingsHistory();
    setState((prev) => ({
      ...prev,
      recentReadings: [],
    }));
  }, []);

  // Get reading type info
  const getReadingTypeInfo = useCallback(
    (type: ReadingType) => tarotService.getReadingTypeInfo(type),
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
