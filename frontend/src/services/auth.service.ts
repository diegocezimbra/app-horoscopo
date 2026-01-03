/**
 * Authentication Service
 * Handles authentication API calls, token management, and session handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'horoscope_auth_token';
const REFRESH_TOKEN_KEY = 'horoscope_refresh_token';
const USER_KEY = 'horoscope_user';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  birthDate?: string;
  sunSign?: string;
  isPremium?: boolean;
  subscriptionTier?: 'free' | 'basic' | 'premium';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birthDate?: string;
}

export interface UpdateProfileData {
  name?: string;
  avatarUrl?: string;
  birthDate?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Get stored authentication token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store authentication tokens
 */
const setTokens = (token: string, refreshToken?: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Clear all stored tokens and user data
 */
const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Store user data in localStorage
 */
const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Create headers with authorization token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response and errors
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse<AuthResponse>(response);

  // Store tokens and user
  setTokens(data.token, data.refreshToken);
  setStoredUser(data.user);

  return data;
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<AuthResponse>(response);

  // Store tokens and user
  setTokens(result.token, result.refreshToken);
  setStoredUser(result.user);

  return result;
};

/**
 * Logout user - clear all stored data
 */
export const logout = (): void => {
  clearTokens();
};

/**
 * Update user profile (calls /users/profile endpoint)
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const user = await handleResponse<User>(response);
  setStoredUser(user);

  return user;
};

/**
 * Refresh authentication token
 */
export const refreshSession = async (): Promise<AuthResponse | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await handleResponse<AuthResponse>(response);

    // Update stored tokens
    setTokens(data.token, data.refreshToken);
    setStoredUser(data.user);

    return data;
  } catch {
    // Token refresh failed, clear all tokens
    clearTokens();
    return null;
  }
};

/**
 * Verify current token is valid (calls /auth/me endpoint)
 */
export const verifyToken = async (): Promise<User | null> => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Token invalid, try to refresh
      const refreshResult = await refreshSession();
      return refreshResult?.user || null;
    }

    const user = await response.json();
    setStoredUser(user);
    return user;
  } catch {
    // Network error, try to refresh session
    const refreshResult = await refreshSession();
    return refreshResult?.user || null;
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra maiuscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra minuscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos um numero' };
  }
  return { valid: true };
};

// Export auth service object
export const authService = {
  login,
  register,
  logout,
  updateProfile,
  refreshSession,
  verifyToken,
  getToken,
  getStoredUser,
  isAuthenticated,
  validateEmail,
  validatePassword,
};

export default authService;
