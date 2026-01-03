/**
 * useDashboard Hook
 * Custom hook for dashboard state management
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../services/api';
import type {
  DashboardData,
  DashboardState,
  LuckyNumbersData,
} from '../types/dashboard';

const CACHE_KEY = 'dashboard_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedData {
  data: DashboardData;
  timestamp: number;
}

function getCachedData(): DashboardData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedData = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    // Check if it's a new day
    const cachedDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    const isNewDay = cachedDate !== today;

    if (isExpired || isNewDay) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedData(data: DashboardData): void {
  try {
    const cacheEntry: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch {
    // Ignore storage errors
  }
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
    lastFetched: null,
  });

  const [isHoroscopeExpanded, setIsHoroscopeExpanded] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        setState({
          data: cached,
          isLoading: false,
          error: null,
          lastFetched: new Date().toISOString(),
        });
        return;
      }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await dashboardApi.getDailyData();

      // Record visit for streak
      const streakInfo = await dashboardApi.recordVisit();
      data.streak = streakInfo;

      setCachedData(data);

      setState({
        data,
        isLoading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dados',
      }));
    }
  }, []);

  // Regenerate lucky numbers
  const regenerateLuckyNumbers = useCallback(async (): Promise<LuckyNumbersData | null> => {
    try {
      const luckyNumbers = await dashboardApi.regenerateLuckyNumbers();

      setState(prev => {
        if (!prev.data) return prev;

        const newData = {
          ...prev.data,
          luckyNumbers,
        };

        setCachedData(newData);

        return {
          ...prev,
          data: newData,
        };
      });

      return luckyNumbers;
    } catch (error) {
      console.error('Error regenerating lucky numbers:', error);
      return null;
    }
  }, []);

  // Toggle horoscope expanded state
  const toggleHoroscope = useCallback(() => {
    setIsHoroscopeExpanded(prev => !prev);
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format date helper
  const formatDate = useCallback((date: Date = new Date()): string => {
    const days = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const months = [
      'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayName}, ${day} de ${month}`;
  }, []);

  return {
    ...state,
    isHoroscopeExpanded,
    toggleHoroscope,
    regenerateLuckyNumbers,
    refresh,
    formatDate,
  };
}

export default useDashboard;
