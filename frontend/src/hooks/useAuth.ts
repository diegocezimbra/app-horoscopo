import { useMemo, useCallback, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { validateEmail, validatePassword, RegisterData } from '../services/auth.service';

/**
 * Custom hook for authentication with additional utilities
 */
export function useAuth() {
  const context = useAuthContext();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validate login credentials
  const validateLoginCredentials = useCallback(
    (email: string, password: string): boolean => {
      const errors: Record<string, string> = {};

      if (!email) {
        errors.email = 'Email e obrigatorio';
      } else if (!validateEmail(email)) {
        errors.email = 'Email invalido';
      }

      if (!password) {
        errors.password = 'Senha e obrigatoria';
      } else if (password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    []
  );

  // Validate registration data
  const validateRegistrationData = useCallback(
    (data: { email: string; password: string; confirmPassword: string; name: string }): boolean => {
      const errors: Record<string, string> = {};

      // Validate name
      if (!data.name) {
        errors.name = 'Nome e obrigatorio';
      } else if (data.name.length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres';
      }

      // Validate email
      if (!data.email) {
        errors.email = 'Email e obrigatorio';
      } else if (!validateEmail(data.email)) {
        errors.email = 'Email invalido';
      }

      // Validate password
      if (!data.password) {
        errors.password = 'Senha e obrigatoria';
      } else {
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          errors.password = passwordValidation.message || 'Senha invalida';
        }
      }

      // Validate confirm password
      if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirmacao de senha e obrigatoria';
      } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas nao coincidem';
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    []
  );

  // Clear validation errors
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  // Clear specific validation error
  const clearValidationError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Login with validation
  const loginWithValidation = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (!validateLoginCredentials(email, password)) {
        return false;
      }

      try {
        await context.login(email, password);
        return true;
      } catch {
        return false;
      }
    },
    [context, validateLoginCredentials]
  );

  // Register with validation
  const registerWithValidation = useCallback(
    async (data: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      birthDate?: string;
    }): Promise<boolean> => {
      if (!validateRegistrationData(data)) {
        return false;
      }

      try {
        const registerData: RegisterData = {
          email: data.email,
          password: data.password,
          name: data.name,
          birthDate: data.birthDate,
        };
        await context.register(registerData);
        return true;
      } catch {
        return false;
      }
    },
    [context, validateRegistrationData]
  );

  // Check if user has completed onboarding
  const hasCompletedOnboarding = useMemo(() => {
    if (!context.user) return false;
    return !!context.user.birthDate;
  }, [context.user]);

  // Get user initials for avatar
  const userInitials = useMemo(() => {
    if (!context.user?.name) return '';
    const names = context.user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }, [context.user?.name]);

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    if (!context.user?.name) return '';

    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour >= 5 && hour < 12) {
      timeGreeting = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'Boa tarde';
    } else {
      timeGreeting = 'Boa noite';
    }

    return `${timeGreeting}, ${context.user.name.split(' ')[0]}!`;
  }, [context.user?.name]);

  return {
    // State from context
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,

    // Actions from context
    login: context.login,
    register: context.register,
    logout: context.logout,
    updateProfile: context.updateProfile,
    clearError: context.clearError,

    // Validation
    validationErrors,
    validateLoginCredentials,
    validateRegistrationData,
    clearValidationErrors,
    clearValidationError,

    // Enhanced actions
    loginWithValidation,
    registerWithValidation,

    // Computed values
    hasCompletedOnboarding,
    userInitials,
    greeting,
  };
}
