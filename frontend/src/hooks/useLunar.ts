/**
 * useLunar Hook
 * Manages lunar data and calendar state
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentMoon,
  getLunarCalendar,
  getUpcomingEvents,
  CurrentMoonData,
  LunarDayInfo,
  LunarEvent,
} from '../services/lunar.service';

export interface LunarState {
  currentMoon: CurrentMoonData | null;
  calendar: LunarDayInfo[];
  upcomingEvents: LunarEvent[];
  selectedDay: LunarDayInfo | null;
  currentMonth: number;
  currentYear: number;
  isLoading: boolean;
  error: string | null;
}

export interface UseLunarReturn extends LunarState {
  selectDay: (day: LunarDayInfo | null) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  refreshData: () => void;
}

export const useLunar = (): UseLunarReturn => {
  const today = new Date();

  const [state, setState] = useState<LunarState>({
    currentMoon: null,
    calendar: [],
    upcomingEvents: [],
    selectedDay: null,
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    isLoading: true,
    error: null,
  });

  const loadData = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const currentMoon = getCurrentMoon();
      const calendar = getLunarCalendar(state.currentYear, state.currentMonth);
      const upcomingEvents = getUpcomingEvents();

      setState((prev) => ({
        ...prev,
        currentMoon,
        calendar,
        upcomingEvents,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar dados lunares',
      }));
    }
  }, [state.currentMonth, state.currentYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectDay = useCallback((day: LunarDayInfo | null) => {
    setState((prev) => ({ ...prev, selectedDay: day }));
  }, []);

  const goToNextMonth = useCallback(() => {
    setState((prev) => {
      let newMonth = prev.currentMonth + 1;
      let newYear = prev.currentYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      return {
        ...prev,
        currentMonth: newMonth,
        currentYear: newYear,
        selectedDay: null,
      };
    });
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState((prev) => {
      let newMonth = prev.currentMonth - 1;
      let newYear = prev.currentYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }

      return {
        ...prev,
        currentMonth: newMonth,
        currentYear: newYear,
        selectedDay: null,
      };
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setState((prev) => ({
      ...prev,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      selectedDay: null,
    }));
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    selectDay,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    refreshData,
  };
};

export default useLunar;
