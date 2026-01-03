/**
 * Profiles Service
 * Handles profile CRUD operations with localStorage persistence
 */

import {
  Profile,
  ProfileFormData,
  ProfileType,
  ZodiacSignId,
} from '../types/profiles';

const STORAGE_KEY = 'horoscope_profiles';
const MAIN_PROFILE_KEY = 'horoscope_main_profile';

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate zodiac sign from birth date
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
 * Generate personality traits based on zodiac sign
 */
const generateTraits = (signId: ZodiacSignId): string[] => {
  const traitsMap: Record<ZodiacSignId, string[]> = {
    aries: ['Corajoso', 'Energetico', 'Lider nato', 'Impulsivo', 'Aventureiro'],
    taurus: ['Determinado', 'Leal', 'Paciente', 'Sensual', 'Pratico'],
    gemini: ['Comunicativo', 'Curioso', 'Versatil', 'Inteligente', 'Adaptavel'],
    cancer: ['Sensivel', 'Protetor', 'Intuitivo', 'Carinhoso', 'Familiar'],
    leo: ['Carismatico', 'Generoso', 'Criativo', 'Dramatico', 'Lider'],
    virgo: ['Analitico', 'Perfeccionista', 'Prestativo', 'Organizado', 'Pratico'],
    libra: ['Diplomatico', 'Harmonioso', 'Justo', 'Social', 'Romantico'],
    scorpio: ['Intenso', 'Misterioso', 'Passional', 'Estrategico', 'Leal'],
    sagittarius: ['Otimista', 'Aventureiro', 'Filosofico', 'Honesto', 'Livre'],
    capricorn: ['Ambicioso', 'Disciplinado', 'Responsavel', 'Tradicional', 'Paciente'],
    aquarius: ['Inovador', 'Independente', 'Humanitario', 'Original', 'Rebelde'],
    pisces: ['Sonhador', 'Compassivo', 'Artistico', 'Intuitivo', 'Romantico'],
  };

  return traitsMap[signId] || [];
};

/**
 * Get all profiles from localStorage
 */
export const getAllProfiles = (): Profile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Get main profile
 */
export const getMainProfile = (): Profile | null => {
  try {
    const stored = localStorage.getItem(MAIN_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Get profile by ID
 */
export const getProfileById = (id: string): Profile | null => {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.id === id) || getMainProfile();
};

/**
 * Create a new profile
 */
export const createProfile = (data: ProfileFormData): Profile => {
  const now = new Date().toISOString();
  const sunSign = getZodiacSignFromDate(data.birthDate);

  const profile: Profile = {
    id: generateId(),
    type: data.type,
    name: data.name,
    avatarUrl: data.avatarUrl,
    birthDate: data.birthDate,
    birthTime: data.birthTime,
    birthPlace: data.birthPlace,
    sunSign,
    traits: generateTraits(sunSign),
    createdAt: now,
    updatedAt: now,
  };

  if (data.type === 'main') {
    localStorage.setItem(MAIN_PROFILE_KEY, JSON.stringify(profile));
  } else {
    const profiles = getAllProfiles();
    profiles.push(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  return profile;
};

/**
 * Update a profile
 */
export const updateProfile = (id: string, data: Partial<ProfileFormData>): Profile | null => {
  const mainProfile = getMainProfile();

  if (mainProfile && mainProfile.id === id) {
    const updated: Profile = {
      ...mainProfile,
      ...data,
      sunSign: data.birthDate ? getZodiacSignFromDate(data.birthDate) : mainProfile.sunSign,
      traits: data.birthDate ? generateTraits(getZodiacSignFromDate(data.birthDate)) : mainProfile.traits,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(MAIN_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }

  const profiles = getAllProfiles();
  const index = profiles.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updated: Profile = {
    ...profiles[index],
    ...data,
    sunSign: data.birthDate ? getZodiacSignFromDate(data.birthDate) : profiles[index].sunSign,
    traits: data.birthDate
      ? generateTraits(getZodiacSignFromDate(data.birthDate))
      : profiles[index].traits,
    updatedAt: new Date().toISOString(),
  };

  profiles[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));

  return updated;
};

/**
 * Delete a profile (cannot delete main profile)
 */
export const deleteProfile = (id: string): boolean => {
  const mainProfile = getMainProfile();
  if (mainProfile && mainProfile.id === id) {
    return false; // Cannot delete main profile
  }

  const profiles = getAllProfiles();
  const filtered = profiles.filter((p) => p.id !== id);

  if (filtered.length === profiles.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Get profiles by type
 */
export const getProfilesByType = (type: ProfileType): Profile[] => {
  if (type === 'main') {
    const main = getMainProfile();
    return main ? [main] : [];
  }
  return getAllProfiles().filter((p) => p.type === type);
};

/**
 * Search celebrities (mock data for now)
 */
export const searchCelebrities = (query: string): Profile[] => {
  const celebrities: Profile[] = [
    {
      id: 'celeb_1',
      type: 'celebrity',
      name: 'Anitta',
      birthDate: '1993-03-30',
      sunSign: 'aries',
      traits: ['Ousada', 'Determinada', 'Carismatica'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'celeb_2',
      type: 'celebrity',
      name: 'Neymar Jr',
      birthDate: '1992-02-05',
      sunSign: 'aquarius',
      traits: ['Criativo', 'Ousado', 'Talentoso'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'celeb_3',
      type: 'celebrity',
      name: 'Gisele Bundchen',
      birthDate: '1980-07-20',
      sunSign: 'cancer',
      traits: ['Sensivel', 'Determinada', 'Elegante'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'celeb_4',
      type: 'celebrity',
      name: 'Xuxa',
      birthDate: '1963-03-27',
      sunSign: 'aries',
      traits: ['Energetica', 'Carismatica', 'Generosa'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'celeb_5',
      type: 'celebrity',
      name: 'Ivete Sangalo',
      birthDate: '1972-05-27',
      sunSign: 'gemini',
      traits: ['Comunicativa', 'Alegre', 'Versatil'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  if (!query) return celebrities;

  const lowerQuery = query.toLowerCase();
  return celebrities.filter((c) => c.name.toLowerCase().includes(lowerQuery));
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
