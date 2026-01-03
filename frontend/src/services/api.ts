/**
 * Dashboard API Service
 * Handles all API calls for the dashboard
 */

import type {
  DashboardData,
  DailyHoroscope,
  StreakInfo,
  LuckyNumbersData,
  ZodiacSignId,
  CosmicEvent,
} from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API calls
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('horoscope_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Erro ao comunicar com o servidor',
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API Functions
export const dashboardApi = {
  /**
   * Get all dashboard data for the current user
   */
  getDailyData: async (): Promise<DashboardData> => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<DashboardData>(response);
  },

  /**
   * Get horoscope for a specific sign
   */
  getHoroscope: async (sign: ZodiacSignId): Promise<DailyHoroscope> => {
    const response = await fetch(`${API_BASE_URL}/astrology/horoscope/daily/${sign}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<{
      sign: string;
      date: string;
      title: string;
      summary: string;
      fullReading: string;
      love: number;
      career: number;
      health: number;
      luck: number;
      luckyNumbers: number[];
      luckyColor: string;
      advice: string;
    }>(response);

    // Transform backend response to frontend format
    const zodiacNames: Record<string, { name: string; symbol: string }> = {
      aries: { name: 'Aries', symbol: '\u2648' },
      taurus: { name: 'Touro', symbol: '\u2649' },
      gemini: { name: 'Gemeos', symbol: '\u264A' },
      cancer: { name: 'Cancer', symbol: '\u264B' },
      leo: { name: 'Leao', symbol: '\u264C' },
      virgo: { name: 'Virgem', symbol: '\u264D' },
      libra: { name: 'Libra', symbol: '\u264E' },
      scorpio: { name: 'Escorpiao', symbol: '\u264F' },
      sagittarius: { name: 'Sagitario', symbol: '\u2650' },
      capricorn: { name: 'Capricornio', symbol: '\u2651' },
      aquarius: { name: 'Aquario', symbol: '\u2652' },
      pisces: { name: 'Peixes', symbol: '\u2653' },
    };

    return {
      sign,
      signName: zodiacNames[sign]?.name || sign,
      symbol: zodiacNames[sign]?.symbol || '',
      title: data.title,
      preview: data.summary,
      fullText: data.fullReading,
      date: data.date,
      energyRating: Math.ceil((data.love + data.career + data.health) / 60),
    };
  },

  /**
   * Record a user visit and update streak
   */
  recordVisit: async (): Promise<StreakInfo> => {
    const response = await fetch(`${API_BASE_URL}/gamification/visit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    const data = await handleResponse<{
      streak: {
        currentStreak: number;
        longestStreak: number;
        lastVisitDate: string;
        streakFreezes: number;
      };
    }>(response);

    const milestones = [7, 14, 21, 30, 50, 100, 365];
    const isMilestone = milestones.includes(data.streak.currentStreak);

    return {
      currentStreak: data.streak.currentStreak,
      longestStreak: data.streak.longestStreak,
      lastVisit: data.streak.lastVisitDate,
      isMilestone,
      milestoneMessage: isMilestone ? `Parabens! ${data.streak.currentStreak} dias seguidos!` : undefined,
    };
  },

  /**
   * Generate new lucky numbers
   */
  regenerateLuckyNumbers: async (): Promise<LuckyNumbersData> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/lucky-numbers`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return handleResponse<LuckyNumbersData>(response);
  },

  /**
   * Get cosmic events
   */
  getCosmicEvents: async (): Promise<CosmicEvent[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/cosmic-events`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<CosmicEvent[]>(response);
  },
};

export default dashboardApi;
