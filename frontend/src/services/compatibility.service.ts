/**
 * Compatibility Service
 * Handles compatibility calculations via backend API
 */

import { ZodiacSignId } from '../types/profiles';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const RECENT_COMPARISONS_KEY = 'horoscope_recent_comparisons';
const MAX_RECENT_COMPARISONS = 10;

// Types matching backend DTOs
export interface CompatibilityRequest {
  sign1: ZodiacSignId;
  sign2: ZodiacSignId;
}

export interface CompatibilityResponse {
  sign1: ZodiacSignId;
  sign2: ZodiacSignId;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  communicationScore: number;
  trustScore: number;
  sharedActivitiesScore: number;
  analysis: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
}

export interface RecentComparison {
  id: string;
  name1: string;
  sign1: ZodiacSignId;
  name2: string;
  sign2: ZodiacSignId;
  score: number;
  createdAt: string;
}

export interface ZodiacSignInfo {
  id: ZodiacSignId;
  name: string;
  nameEn: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  dateRange: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: ZodiacSignId[];
  description: string;
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
 * Generate unique ID
 */
const generateId = (): string => {
  return `compat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate compatibility between two signs via backend
 */
export const calculateCompatibility = async (
  sign1: ZodiacSignId,
  sign2: ZodiacSignId,
  name1: string = 'Perfil 1',
  name2: string = 'Perfil 2'
): Promise<CompatibilityResponse> => {
  const response = await fetch(`${API_BASE_URL}/astrology/compatibility`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ sign1, sign2 }),
  });

  const result = await handleResponse<CompatibilityResponse>(response);

  // Save to recent comparisons
  saveRecentComparison({
    id: generateId(),
    name1,
    sign1,
    name2,
    sign2,
    score: result.overallScore,
    createdAt: new Date().toISOString(),
  });

  return result;
};

/**
 * Get all zodiac signs
 */
export const getAllSigns = async (): Promise<ZodiacSignInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/astrology/signs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<ZodiacSignInfo[]>(response);
};

/**
 * Get zodiac sign info
 */
export const getSignInfo = async (sign: ZodiacSignId): Promise<ZodiacSignInfo> => {
  const response = await fetch(`${API_BASE_URL}/astrology/signs/${sign}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<ZodiacSignInfo>(response);
};

/**
 * Save comparison to recent history (local storage for quick access)
 */
const saveRecentComparison = (comparison: RecentComparison): void => {
  const recent = getRecentComparisons();
  const updated = [comparison, ...recent.filter((r) => r.id !== comparison.id)].slice(
    0,
    MAX_RECENT_COMPARISONS
  );

  localStorage.setItem(RECENT_COMPARISONS_KEY, JSON.stringify(updated));
};

/**
 * Get recent comparisons (from local storage)
 */
export const getRecentComparisons = (): RecentComparison[] => {
  try {
    const stored = localStorage.getItem(RECENT_COMPARISONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Clear recent comparisons
 */
export const clearRecentComparisons = (): void => {
  localStorage.removeItem(RECENT_COMPARISONS_KEY);
};

export const compatibilityService = {
  calculateCompatibility,
  getAllSigns,
  getSignInfo,
  getRecentComparisons,
  clearRecentComparisons,
};

export default compatibilityService;
