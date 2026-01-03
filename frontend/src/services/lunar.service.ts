/**
 * Lunar Service
 * Handles lunar phase data via backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Types matching backend DTOs
export type MoonPhase =
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface LunarPhaseData {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  illuminationRange: [number, number];
  energy: string;
  description: string;
  rituals: string[];
  crystals: string[];
  colors: string[];
  colorHexes: string[];
  bestFor: string[];
  avoid: string[];
}

export interface CurrentLunarPhase {
  phase: LunarPhaseData;
  illumination: number;
  date: string;
  moonSign: string;
  moonSignName: string;
  advice: string;
}

export interface LunarCalendarDay {
  date: string;
  dayOfWeek: string;
  phase: LunarPhaseData;
  illumination: number;
  isToday: boolean;
  isNewMoon: boolean;
  isFullMoon: boolean;
}

export interface LunarCalendarMonth {
  month: number;
  year: string;
  days: LunarCalendarDay[];
  newMoons: string[];
  fullMoons: string[];
}

export interface NextMoonEvent {
  date: Date;
  daysUntil: number;
}

// Type aliases for page components compatibility
// LunarDayInfo - extends calendar day with Date object for UI
export interface LunarDayInfo {
  date: Date;
  dayOfWeek: string;
  phase: LunarPhaseData;
  illumination: number;
  isToday: boolean;
  isNewMoon: boolean;
  isFullMoon: boolean;
  // Convenience accessors
  emoji: string;
  energy: string;
  rituals: string[];
  crystals: string[];
  colors: string[];
}

// Helper to convert API day to UI day
export const convertToLunarDayInfo = (day: LunarCalendarDay): LunarDayInfo => ({
  date: new Date(day.date),
  dayOfWeek: day.dayOfWeek,
  phase: day.phase,
  illumination: day.illumination,
  isToday: day.isToday,
  isNewMoon: day.isNewMoon,
  isFullMoon: day.isFullMoon,
  emoji: day.phase.emoji,
  energy: day.phase.energy,
  rituals: day.phase.rituals,
  crystals: day.phase.crystals,
  colors: day.phase.colors,
});

// LunarEvent - for upcoming moon events display
export interface LunarEvent {
  id: string;
  type: 'full-moon' | 'new-moon';
  name: string;
  emoji: string;
  date: Date;
  daysUntil: number;
  whatToDo: string[];
}

// CurrentMoonData - for current phase display
export interface CurrentMoonData {
  phase: string;
  name: string;
  emoji: string;
  illumination: number;
  signName: string;
  energy: string;
  description: string;
  rituals: string[];
  crystals: string[];
  colors: string[];
  colorHexes: string[];
}

// Helper to convert API current phase to UI current moon
export const convertToCurrentMoonData = (data: CurrentLunarPhase): CurrentMoonData => ({
  phase: data.phase.id,
  name: data.phase.name,
  emoji: data.phase.emoji,
  illumination: data.illumination,
  signName: data.moonSignName,
  energy: data.phase.energy,
  description: data.phase.description,
  rituals: data.phase.rituals,
  crystals: data.phase.crystals,
  colors: data.phase.colors,
  colorHexes: data.phase.colorHexes,
});

export interface TodayAdvice {
  phase: LunarPhaseData;
  advice: string;
  rituals: string[];
}

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

/**
 * Get current lunar phase
 */
export const getCurrentPhase = async (): Promise<CurrentLunarPhase> => {
  const response = await fetch(`${API_BASE_URL}/lunar/current`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<CurrentLunarPhase>(response);
};

/**
 * Get lunar calendar for a specific month
 */
export const getMonthlyCalendar = async (month: number, year: number): Promise<LunarCalendarMonth> => {
  const response = await fetch(`${API_BASE_URL}/lunar/calendar/${month}/${year}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<LunarCalendarMonth>(response);
};

/**
 * Get next full moon
 */
export const getNextFullMoon = async (): Promise<NextMoonEvent> => {
  const response = await fetch(`${API_BASE_URL}/lunar/next-full-moon`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<NextMoonEvent>(response);
};

/**
 * Get next new moon
 */
export const getNextNewMoon = async (): Promise<NextMoonEvent> => {
  const response = await fetch(`${API_BASE_URL}/lunar/next-new-moon`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<NextMoonEvent>(response);
};

/**
 * Get lunar phase by ID
 */
export const getPhaseById = async (id: string): Promise<LunarPhaseData> => {
  const response = await fetch(`${API_BASE_URL}/lunar/phase/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<LunarPhaseData>(response);
};

/**
 * Get all lunar phases
 */
export const getAllPhases = async (): Promise<LunarPhaseData[]> => {
  const response = await fetch(`${API_BASE_URL}/lunar/phases`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<LunarPhaseData[]>(response);
};

/**
 * Get today's lunar advice
 */
export const getTodayAdvice = async (): Promise<TodayAdvice> => {
  const response = await fetch(`${API_BASE_URL}/lunar/today-advice`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<TodayAdvice>(response);
};

export const lunarService = {
  getCurrentPhase,
  getMonthlyCalendar,
  getNextFullMoon,
  getNextNewMoon,
  getPhaseById,
  getAllPhases,
  getTodayAdvice,
};

export default lunarService;
