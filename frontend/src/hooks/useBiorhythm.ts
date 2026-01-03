/**
 * useBiorhythm Hook
 * Manages biorhythm calculations and state via backend API
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BiorhythmDay,
  BiorhythmCycle,
  CriticalDay,
  BiorhythmCompatibilityResponse,
  getTodayBiorhythm,
  getWeekBiorhythm,
  getMonthBiorhythm,
  getCriticalDays,
  getBiorhythmCompatibility,
} from '../services/biorhythm.service';

export interface BiorhythmState {
  todayValues: BiorhythmCycle[];
  chartData: BiorhythmDay[];
  criticalDays: CriticalDay[];
  compatibility: BiorhythmCompatibilityResponse | null;
  selectedDays: 7 | 30;
  isLoading: boolean;
  error: string | null;
}

export interface UseBiorhythmReturn extends BiorhythmState {
  setSelectedDays: (days: 7 | 30) => void;
  calculateCompatibility: (otherBirthDate: string) => Promise<BiorhythmCompatibilityResponse>;
  refreshData: () => void;
  getValueForDate: (date: string) => BiorhythmDay | undefined;
}

const BIRTH_DATE_KEY = 'horoscope_user_birth_date';

/**
 * Get stored birth date from localStorage
 */
const getStoredBirthDate = (): string | null => {
  try {
    const stored = localStorage.getItem(BIRTH_DATE_KEY);
    if (stored) {
      const date = new Date(stored);
      if (!isNaN(date.getTime())) {
        return stored;
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Get birth date from profiles or use stored
 */
const getUserBirthDate = (): string => {
  try {
    const profilesData = localStorage.getItem('horoscope_profiles');
    if (profilesData) {
      const profiles = JSON.parse(profilesData);
      const mainProfile = profiles.find((p: { type: string }) => p.type === 'main');
      if (mainProfile?.birthDate) {
        return mainProfile.birthDate;
      }
    }
  } catch {
    // Ignore errors
  }

  const stored = getStoredBirthDate();
  if (stored) {
    return stored;
  }

  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 30);
  return defaultDate.toISOString().split('T')[0];
};

export const useBiorhythm = (birthDateOverride?: string): UseBiorhythmReturn => {
  const birthDate = birthDateOverride || getUserBirthDate();

  const [state, setState] = useState<BiorhythmState>({
    todayValues: [],
    chartData: [],
    criticalDays: [],
    compatibility: null,
    selectedDays: 7,
    isLoading: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [todayData, periodData, criticalData] = await Promise.all([
        getTodayBiorhythm(birthDate),
        state.selectedDays === 7 ? getWeekBiorhythm(birthDate) : getMonthBiorhythm(birthDate),
        getCriticalDays(birthDate),
      ]);

      setState((prev) => ({
        ...prev,
        todayValues: todayData.cycles,
        chartData: periodData.days,
        criticalDays: criticalData.criticalDays,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao calcular biorritmos',
      }));
    }
  }, [birthDate, state.selectedDays]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setSelectedDays = useCallback((days: 7 | 30) => {
    setState((prev) => {
      if (prev.selectedDays === days) return prev;
      return { ...prev, selectedDays: days };
    });
  }, []);

  const calculateCompatibilityFn = useCallback(
    async (otherBirthDate: string): Promise<BiorhythmCompatibilityResponse> => {
      const compatibility = await getBiorhythmCompatibility(birthDate, otherBirthDate);
      setState((prev) => ({
        ...prev,
        compatibility,
      }));
      return compatibility;
    },
    [birthDate]
  );

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const getValueForDate = useCallback(
    (date: string): BiorhythmDay | undefined => {
      return state.chartData.find((d) => d.date === date);
    },
    [state.chartData]
  );

  return useMemo(
    () => ({
      ...state,
      setSelectedDays,
      calculateCompatibility: calculateCompatibilityFn,
      refreshData,
      getValueForDate,
    }),
    [state, setSelectedDays, calculateCompatibilityFn, refreshData, getValueForDate]
  );
};

export default useBiorhythm;
