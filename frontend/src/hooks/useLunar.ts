/**
 * useLunar Hook
 * Manages lunar data and calendar state via backend API
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentPhase,
  getMonthlyCalendar,
  getNextFullMoon,
  getNextNewMoon,
  LunarDayInfo,
  LunarEvent,
  CurrentMoonData,
  convertToLunarDayInfo,
  convertToCurrentMoonData,
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
    currentMonth: today.getMonth() + 1, // API uses 1-12
    currentYear: today.getFullYear(),
    isLoading: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [currentMoonData, calendarData, nextFull, nextNew] = await Promise.all([
        getCurrentPhase(),
        getMonthlyCalendar(state.currentMonth, state.currentYear),
        getNextFullMoon(),
        getNextNewMoon(),
      ]);

      const upcomingEvents: LunarEvent[] = [
        {
          id: 'next-full-moon',
          type: 'full-moon' as const,
          name: 'Lua Cheia',
          emoji: '\uD83C\uDF15',
          date: new Date(nextFull.date),
          daysUntil: nextFull.daysUntil,
          whatToDo: [
            'Celebrar conquistas',
            'Rituais de agradecimento',
            'Carregar cristais na luz da lua',
          ],
        },
        {
          id: 'next-new-moon',
          type: 'new-moon' as const,
          name: 'Lua Nova',
          emoji: '\uD83C\uDF11',
          date: new Date(nextNew.date),
          daysUntil: nextNew.daysUntil,
          whatToDo: [
            'Definir novas intencoes',
            'Comecar novos projetos',
            'Meditacao e introspeccao',
          ],
        },
      ].sort((a, b) => a.daysUntil - b.daysUntil);

      setState((prev) => ({
        ...prev,
        currentMoon: convertToCurrentMoonData(currentMoonData),
        calendar: calendarData.days.map(convertToLunarDayInfo),
        upcomingEvents,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar dados lunares',
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

      if (newMonth > 12) {
        newMonth = 1;
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

      if (newMonth < 1) {
        newMonth = 12;
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
      currentMonth: today.getMonth() + 1,
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
