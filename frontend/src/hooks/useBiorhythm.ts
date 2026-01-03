/**
 * useBiorhythm Hook
 * Manages biorhythm calculations and state
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BiorhythmValue,
  DailyBiorhythm,
  CriticalDay,
  BiorhythmCompatibility,
  getBiorhythmValues,
  getBiorhythmRange,
  getCriticalDays,
  calculateBiorhythmCompatibility,
} from '../services/biorhythm.service';

export interface BiorhythmState {
  todayValues: BiorhythmValue[];
  chartData: DailyBiorhythm[];
  criticalDays: CriticalDay[];
  compatibility: BiorhythmCompatibility | null;
  selectedDays: 7 | 30;
  isLoading: boolean;
  error: string | null;
}

export interface UseBiorhythmReturn extends BiorhythmState {
  setSelectedDays: (days: 7 | 30) => void;
  calculateCompatibility: (otherBirthDate: string) => BiorhythmCompatibility;
  refreshData: () => void;
  getValueForDate: (date: string) => DailyBiorhythm | undefined;
}

const BIRTH_DATE_KEY = 'horoscope_user_birth_date';

/**
 * Get stored birth date from localStorage
 */
const getStoredBirthDate = (): string | null => {
  try {
    const stored = localStorage.getItem(BIRTH_DATE_KEY);
    if (stored) {
      // Validate it's a valid date
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
  // Try to get from profiles storage first
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

  // Fallback to stored birth date
  const stored = getStoredBirthDate();
  if (stored) {
    return stored;
  }

  // Default to a sample date if nothing found (30 years ago)
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

  const loadData = useCallback(() => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const todayValues = getBiorhythmValues(birthDate);
      const chartData = getBiorhythmRange(birthDate, state.selectedDays);
      const criticalDays = getCriticalDays(birthDate, 30);

      setState((prev) => ({
        ...prev,
        todayValues,
        chartData,
        criticalDays,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao calcular biorritmos',
      }));
    }
  }, [birthDate, state.selectedDays]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setSelectedDays = useCallback((days: 7 | 30) => {
    setState((prev) => {
      if (prev.selectedDays === days) return prev;

      const chartData = getBiorhythmRange(birthDate, days);
      return {
        ...prev,
        selectedDays: days,
        chartData,
      };
    });
  }, [birthDate]);

  const calculateCompatibilityFn = useCallback(
    (otherBirthDate: string): BiorhythmCompatibility => {
      const compatibility = calculateBiorhythmCompatibility(birthDate, otherBirthDate);
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
    (date: string): DailyBiorhythm | undefined => {
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
