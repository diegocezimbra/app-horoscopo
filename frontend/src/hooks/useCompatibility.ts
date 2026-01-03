/**
 * useCompatibility Hook
 * Manages compatibility calculations and history
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Profile,
  ZodiacSignId,
  CompatibilityResult,
  CompatibilityState,
} from '../types/profiles';
import {
  calculateCompatibility,
  getRecentComparisons,
  clearRecentComparisons,
  getQuickCompatibility,
} from '../services/compatibility.service';

export interface UseCompatibilityReturn extends CompatibilityState {
  compare: (
    profile1: Profile | { name: string; sign: ZodiacSignId },
    profile2: Profile | { name: string; sign: ZodiacSignId }
  ) => CompatibilityResult;
  quickCompare: (sign1: ZodiacSignId, sign2: ZodiacSignId) => number;
  clearHistory: () => void;
  refreshHistory: () => void;
  clearCurrentResult: () => void;
}

export const useCompatibility = (): UseCompatibilityReturn => {
  const [state, setState] = useState<CompatibilityState>({
    currentResult: null,
    recentComparisons: [],
    isLoading: true,
    error: null,
  });

  const loadRecentComparisons = useCallback(() => {
    try {
      const comparisons = getRecentComparisons();
      setState((prev) => ({
        ...prev,
        recentComparisons: comparisons,
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
    loadRecentComparisons();
  }, [loadRecentComparisons]);

  const compare = useCallback(
    (
      profile1: Profile | { name: string; sign: ZodiacSignId },
      profile2: Profile | { name: string; sign: ZodiacSignId }
    ): CompatibilityResult => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = calculateCompatibility(profile1, profile2);
        setState((prev) => ({
          ...prev,
          currentResult: result,
          recentComparisons: getRecentComparisons(),
          isLoading: false,
          error: null,
        }));
        return result;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao calcular compatibilidade',
        }));
        throw err;
      }
    },
    []
  );

  const quickCompare = useCallback(
    (sign1: ZodiacSignId, sign2: ZodiacSignId): number => {
      return getQuickCompatibility(sign1, sign2);
    },
    []
  );

  const clearHistory = useCallback(() => {
    clearRecentComparisons();
    setState((prev) => ({
      ...prev,
      recentComparisons: [],
    }));
  }, []);

  const refreshHistory = useCallback(() => {
    loadRecentComparisons();
  }, [loadRecentComparisons]);

  const clearCurrentResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentResult: null,
    }));
  }, []);

  return {
    ...state,
    compare,
    quickCompare,
    clearHistory,
    refreshHistory,
    clearCurrentResult,
  };
};

export default useCompatibility;
