/**
 * useProfiles Hook
 * Manages profile state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Profile,
  ProfileFormData,
  ProfilesState,
} from '../types/profiles';
import {
  getAllProfiles,
  getMainProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
  searchCelebrities,
} from '../services/profiles.service';

export interface UseProfilesReturn extends ProfilesState {
  getAllProfilesList: () => Promise<Profile[]>;
  getProfile: (id: string) => Promise<Profile | null>;
  addProfile: (data: ProfileFormData) => Promise<Profile>;
  editProfile: (id: string, data: Partial<ProfileFormData>) => Promise<Profile | null>;
  removeProfile: (id: string) => Promise<boolean>;
  searchCelebs: (query: string) => Promise<Profile[]>;
  refreshProfiles: () => Promise<void>;
}

export const useProfiles = (): UseProfilesReturn => {
  const [state, setState] = useState<ProfilesState>({
    profiles: [],
    mainProfile: null,
    isLoading: true,
    error: null,
  });

  const loadProfiles = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const [profiles, mainProfile] = await Promise.all([
        getAllProfiles(),
        getMainProfile(),
      ]);
      setState({
        profiles,
        mainProfile,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar perfis',
      }));
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const getAllProfilesList = useCallback(async (): Promise<Profile[]> => {
    const [main, others] = await Promise.all([
      getMainProfile(),
      getAllProfiles(),
    ]);
    return main ? [main, ...others] : others;
  }, []);

  const getProfile = useCallback(async (id: string): Promise<Profile | null> => {
    return getProfileById(id);
  }, []);

  const addProfile = useCallback(async (data: ProfileFormData): Promise<Profile> => {
    const profile = await createProfile(data);
    await loadProfiles();
    return profile;
  }, [loadProfiles]);

  const editProfile = useCallback(
    async (id: string, data: Partial<ProfileFormData>): Promise<Profile | null> => {
      try {
        const profile = await updateProfile(id, data);
        await loadProfiles();
        return profile;
      } catch {
        return null;
      }
    },
    [loadProfiles]
  );

  const removeProfile = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const success = await deleteProfile(id);
        if (success) {
          await loadProfiles();
        }
        return success;
      } catch {
        return false;
      }
    },
    [loadProfiles]
  );

  const searchCelebs = useCallback(async (query: string): Promise<Profile[]> => {
    return searchCelebrities(query);
  }, []);

  const refreshProfiles = useCallback(async () => {
    await loadProfiles();
  }, [loadProfiles]);

  return {
    ...state,
    getAllProfilesList,
    getProfile,
    addProfile,
    editProfile,
    removeProfile,
    searchCelebs,
    refreshProfiles,
  };
};

export default useProfiles;
