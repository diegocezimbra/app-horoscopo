/**
 * Biorhythm Service
 * Handles biorhythm calculations via backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export type BiorhythmType = 'physical' | 'emotional' | 'intellectual';

export interface BiorhythmCycle {
  type: BiorhythmType;
  value: number;
  percentage: number;
  label: string;
  color: string;
  description: string;
  trend: 'rising' | 'falling' | 'peak' | 'low' | 'critical';
}

export interface BiorhythmDay {
  date: string;
  daysLived: number;
  cycles: BiorhythmCycle[];
  overallEnergy: number;
  advice: string;
}

// Legacy flat format for UI compatibility
export interface DailyBiorhythm {
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
}

// Helper to convert BiorhythmDay to DailyBiorhythm
export const convertToDailyBiorhythm = (day: BiorhythmDay): DailyBiorhythm => {
  const getCycleValue = (type: BiorhythmType): number => {
    const cycle = day.cycles.find((c) => c.type === type);
    return cycle?.value ?? 0;
  };

  return {
    date: day.date,
    physical: getCycleValue('physical'),
    emotional: getCycleValue('emotional'),
    intellectual: getCycleValue('intellectual'),
  };
};

export interface BiorhythmPeriodResponse {
  startDate: string;
  endDate: string;
  days: BiorhythmDay[];
  summary: {
    bestDays: string[];
    challengingDays: string[];
    averageEnergy: number;
  };
}

export interface CriticalDay {
  date: string;
  type: BiorhythmType;
  label: string;
  color: string;
  advice: string;
  daysUntil: number;
}

export interface CriticalDaysResponse {
  criticalDays: CriticalDay[];
  nextCriticalDay: CriticalDay | null;
  advice: string;
}

export interface BiorhythmCompatibilityResponse {
  date: string;
  person1: {
    birthDate: string;
    cycles: BiorhythmCycle[];
  };
  person2: {
    birthDate: string;
    cycles: BiorhythmCycle[];
  };
  compatibility: {
    physical: number;
    emotional: number;
    intellectual: number;
    overall: number;
  };
  description: string;
  advice: string;
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
 * Get today's biorhythm
 */
export const getTodayBiorhythm = async (birthDate: string): Promise<BiorhythmDay> => {
  const response = await fetch(
    `${API_BASE_URL}/biorhythm/today?birthDate=${encodeURIComponent(birthDate)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BiorhythmDay>(response);
};

/**
 * Get week biorhythm
 */
export const getWeekBiorhythm = async (birthDate: string): Promise<BiorhythmPeriodResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/biorhythm/week?birthDate=${encodeURIComponent(birthDate)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BiorhythmPeriodResponse>(response);
};

/**
 * Get month biorhythm
 */
export const getMonthBiorhythm = async (birthDate: string): Promise<BiorhythmPeriodResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/biorhythm/month?birthDate=${encodeURIComponent(birthDate)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BiorhythmPeriodResponse>(response);
};

/**
 * Get critical days
 */
export const getCriticalDays = async (birthDate: string): Promise<CriticalDaysResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/biorhythm/critical-days?birthDate=${encodeURIComponent(birthDate)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CriticalDaysResponse>(response);
};

/**
 * Get biorhythm compatibility between two people
 */
export const getBiorhythmCompatibility = async (
  birthDate1: string,
  birthDate2: string
): Promise<BiorhythmCompatibilityResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/biorhythm/compatibility?birthDate1=${encodeURIComponent(birthDate1)}&birthDate2=${encodeURIComponent(birthDate2)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<BiorhythmCompatibilityResponse>(response);
};

/**
 * Format date for display
 */
export const formatBiorhythmDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return 'Hoje';
  }
  if (dateString === tomorrow.toISOString().split('T')[0]) {
    return 'Amanha';
  }

  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const biorhythmService = {
  getTodayBiorhythm,
  getWeekBiorhythm,
  getMonthBiorhythm,
  getCriticalDays,
  getBiorhythmCompatibility,
  formatBiorhythmDate,
};

export default biorhythmService;
