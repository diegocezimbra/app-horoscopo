/**
 * Tarot Service
 * Handles tarot card readings via backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Types matching backend DTOs
export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export type ReadingType = 'single' | 'past-present-future' | 'celtic-cross';

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: TarotSuit;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  advice: string;
  loveAdvice: string;
  careerAdvice: string;
  healthAdvice: string;
  yesNoMeaning: 'yes' | 'no' | 'maybe';
  imageUrl: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: number;
  positionName: string;
  positionInterpretation: string;
}

export interface TarotReading {
  cards: DrawnCard[];
  spreadType: string;
  spreadName: string;
  question?: string;
  overallGuidance: string;
  timestamp: string;
}

export interface DailyCard {
  card: TarotCard;
  isReversed: boolean;
  dailyGuidance: string;
  affirmation: string;
  date: string;
  alreadyDrew: boolean;
}

export interface SpreadType {
  id: string;
  name: string;
  description: string;
  numberOfCards: number;
  positions: {
    position: number;
    name: string;
    meaning: string;
  }[];
  recommendedFor: string[];
  imageUrl: string;
}

export interface SuitInfo {
  id: string;
  name: string;
  nameEn: string;
  element: string;
  keywords: string[];
  description: string;
  color: string;
}

export interface DrawCardRequest {
  numberOfCards: 1 | 3 | 10;
  spreadType?: ReadingType;
  includeReversed?: boolean;
  question?: string;
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

// Service functions
export const tarotService = {
  /**
   * Get the daily card
   */
  getDailyCard: async (userId?: string): Promise<DailyCard> => {
    const url = userId
      ? `${API_BASE_URL}/tarot/daily?userId=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/tarot/daily`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<DailyCard>(response);
  },

  /**
   * Get personalized daily card for authenticated user
   */
  getPersonalizedDailyCard: async (): Promise<DailyCard> => {
    const response = await fetch(`${API_BASE_URL}/tarot/daily/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<DailyCard>(response);
  },

  /**
   * Draw cards for a reading
   */
  drawCards: async (request: DrawCardRequest): Promise<TarotReading> => {
    const response = await fetch(`${API_BASE_URL}/tarot/draw`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    return handleResponse<TarotReading>(response);
  },

  /**
   * Draw cards for authenticated user (with tracking)
   */
  drawCardsAuthenticated: async (request: DrawCardRequest): Promise<TarotReading> => {
    const response = await fetch(`${API_BASE_URL}/tarot/draw/me`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    return handleResponse<TarotReading>(response);
  },

  /**
   * Get a specific card by ID
   */
  getCardById: async (cardId: string): Promise<TarotCard> => {
    const response = await fetch(`${API_BASE_URL}/tarot/card/${encodeURIComponent(cardId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<TarotCard>(response);
  },

  /**
   * Get all tarot cards
   */
  getAllCards: async (): Promise<TarotCard[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/cards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<TarotCard[]>(response);
  },

  /**
   * Get Major Arcana cards
   */
  getMajorArcana: async (): Promise<TarotCard[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/cards/major`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<TarotCard[]>(response);
  },

  /**
   * Get Minor Arcana cards
   */
  getMinorArcana: async (): Promise<TarotCard[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/cards/minor`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<TarotCard[]>(response);
  },

  /**
   * Get cards by suit
   */
  getCardsBySuit: async (suit: TarotSuit): Promise<TarotCard[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/cards/suit/${suit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<TarotCard[]>(response);
  },

  /**
   * Get available spread types
   */
  getSpreads: async (): Promise<SpreadType[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/spreads`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<SpreadType[]>(response);
  },

  /**
   * Get all suits information
   */
  getSuitsInfo: async (): Promise<SuitInfo[]> => {
    const response = await fetch(`${API_BASE_URL}/tarot/suits`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<SuitInfo[]>(response);
  },

  /**
   * Get specific suit information
   */
  getSuitInfo: async (suit: TarotSuit): Promise<SuitInfo> => {
    const response = await fetch(`${API_BASE_URL}/tarot/suits/${suit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<SuitInfo>(response);
  },
};

export default tarotService;
