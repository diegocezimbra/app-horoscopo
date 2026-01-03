/**
 * useCompatibility Hook
 * Manages compatibility calculations and history via backend API
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Profile,
  ZodiacSignId,
  CompatibilityState,
  RecentComparison,
} from '../types/profiles';
import {
  calculateCompatibility,
  getRecentComparisons,
  clearRecentComparisons,
  CompatibilityResponse,
} from '../services/compatibility.service';

export interface CompatibilityResultDisplay {
  sign1: ZodiacSignId;
  sign2: ZodiacSignId;
  name1: string;
  name2: string;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  communicationScore: number;
  trustScore: number;
  sharedActivitiesScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export interface UseCompatibilityState {
  currentResult: CompatibilityResultDisplay | null;
  recentComparisons: RecentComparison[];
  isLoading: boolean;
  error: string | null;
}

export interface UseCompatibilityReturn extends UseCompatibilityState {
  compare: (
    profile1: Profile | { name: string; sign: ZodiacSignId },
    profile2: Profile | { name: string; sign: ZodiacSignId }
  ) => Promise<CompatibilityResultDisplay>;
  quickCompare: (sign1: ZodiacSignId, sign2: ZodiacSignId) => Promise<number>;
  clearHistory: () => void;
  refreshHistory: () => void;
  clearCurrentResult: () => void;
}

export const useCompatibility = (): UseCompatibilityReturn => {
  const [state, setState] = useState<UseCompatibilityState>({
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
    async (
      profile1: Profile | { name: string; sign: ZodiacSignId },
      profile2: Profile | { name: string; sign: ZodiacSignId }
    ): Promise<CompatibilityResultDisplay> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const sign1 = 'sunSign' in profile1 ? profile1.sunSign : profile1.sign;
        const sign2 = 'sunSign' in profile2 ? profile2.sunSign : profile2.sign;
        const name1 = profile1.name;
        const name2 = profile2.name;

        const response = await calculateCompatibility(sign1, sign2, name1, name2);

        const result: CompatibilityResultDisplay = {
          sign1: response.sign1,
          sign2: response.sign2,
          name1,
          name2,
          overallScore: response.overallScore,
          loveScore: response.loveScore,
          friendshipScore: response.friendshipScore,
          communicationScore: response.communicationScore,
          trustScore: response.trustScore,
          sharedActivitiesScore: response.sharedActivitiesScore,
          strengths: response.analysis.strengths,
          challenges: response.analysis.challenges,
          advice: response.analysis.advice,
        };

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
          error: err instanceof Error ? err.message : 'Erro ao calcular compatibilidade',
        }));
        throw err;
      }
    },
    []
  );

  const quickCompare = useCallback(
    async (sign1: ZodiacSignId, sign2: ZodiacSignId): Promise<number> => {
      try {
        const response = await calculateCompatibility(sign1, sign2);
        return response.overallScore;
      } catch {
        return 50; // Default score on error
      }
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
