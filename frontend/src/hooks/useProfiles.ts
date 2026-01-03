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
  getAllProfilesList: () => Profile[];
  getProfile: (id: string) => Profile | null;
  addProfile: (data: ProfileFormData) => Profile;
  editProfile: (id: string, data: Partial<ProfileFormData>) => Profile | null;
  removeProfile: (id: string) => boolean;
  searchCelebs: (query: string) => Profile[];
  refreshProfiles: () => void;
}

export const useProfiles = (): UseProfilesReturn => {
  const [state, setState] = useState<ProfilesState>({
    profiles: [],
    mainProfile: null,
    isLoading: true,
    error: null,
  });

  const loadProfiles = useCallback(() => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const profiles = getAllProfiles();
      const mainProfile = getMainProfile();
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
        error: 'Erro ao carregar perfis',
      }));
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const getAllProfilesList = useCallback((): Profile[] => {
    const main = getMainProfile();
    const others = getAllProfiles();
    return main ? [main, ...others] : others;
  }, []);

  const getProfile = useCallback((id: string): Profile | null => {
    return getProfileById(id);
  }, []);

  const addProfile = useCallback((data: ProfileFormData): Profile => {
    const profile = createProfile(data);
    loadProfiles();
    return profile;
  }, [loadProfiles]);

  const editProfile = useCallback(
    (id: string, data: Partial<ProfileFormData>): Profile | null => {
      const profile = updateProfile(id, data);
      if (profile) {
        loadProfiles();
      }
      return profile;
    },
    [loadProfiles]
  );

  const removeProfile = useCallback(
    (id: string): boolean => {
      const success = deleteProfile(id);
      if (success) {
        loadProfiles();
      }
      return success;
    },
    [loadProfiles]
  );

  const searchCelebs = useCallback((query: string): Profile[] => {
    return searchCelebrities(query);
  }, []);

  const refreshProfiles = useCallback(() => {
    loadProfiles();
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
