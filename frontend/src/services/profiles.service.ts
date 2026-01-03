/**
 * Profiles Service
 * Handles profile CRUD operations via backend API
 */

import {
  Profile,
  ProfileFormData,
  ProfileType,
  ZodiacSignId,
} from '../types/profiles';

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

/**
 * Calculate zodiac sign from birth date (utility function)
 */
export const getZodiacSignFromDate = (birthDate: string): ZodiacSignId => {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

/**
 * Get all profiles from backend
 */
export const getAllProfiles = async (): Promise<Profile[]> => {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Profile[]>(response);
};

/**
 * Get main profile
 */
export const getMainProfile = async (): Promise<Profile | null> => {
  const response = await fetch(`${API_BASE_URL}/profiles/main`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<Profile>(response);
};

/**
 * Get profile by ID
 */
export const getProfileById = async (id: string): Promise<Profile | null> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<Profile>(response);
};

/**
 * Create a new profile
 */
export const createProfile = async (data: ProfileFormData): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Profile>(response);
};

/**
 * Update a profile
 */
export const updateProfile = async (id: string, data: Partial<ProfileFormData>): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Profile>(response);
};

/**
 * Delete a profile (cannot delete main profile)
 */
export const deleteProfile = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Erro ao excluir perfil',
    }));
    throw new Error(error.message);
  }

  return true;
};

/**
 * Get profiles by type
 */
export const getProfilesByType = async (type: ProfileType): Promise<Profile[]> => {
  const response = await fetch(`${API_BASE_URL}/profiles/type/${type}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Profile[]>(response);
};

/**
 * Search celebrities
 */
export const searchCelebrities = async (query?: string): Promise<Profile[]> => {
  const url = query
    ? `${API_BASE_URL}/profiles/celebrities/search?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/profiles/celebrities/search`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<Profile[]>(response);
};

export default {
  getAllProfiles,
  getMainProfile,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfilesByType,
  searchCelebrities,
  getZodiacSignFromDate,
};
