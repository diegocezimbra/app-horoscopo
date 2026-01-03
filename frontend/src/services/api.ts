/**
 * Dashboard API Service
 * Handles all API calls for the dashboard
 */

import type {
  DashboardData,
  DailyHoroscope,
  StreakInfo,
  LuckyNumbersData,
  ZodiacSignId,
  MoonPhase,
  CosmicEvent,
} from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Zodiac sign data
const zodiacSigns: Record<ZodiacSignId, { name: string; symbol: string; element: 'fire' | 'earth' | 'air' | 'water' }> = {
  aries: { name: 'Aries', symbol: '\u2648', element: 'fire' },
  taurus: { name: 'Touro', symbol: '\u2649', element: 'earth' },
  gemini: { name: 'Gemeos', symbol: '\u264A', element: 'air' },
  cancer: { name: 'Cancer', symbol: '\u264B', element: 'water' },
  leo: { name: 'Leao', symbol: '\u264C', element: 'fire' },
  virgo: { name: 'Virgem', symbol: '\u264D', element: 'earth' },
  libra: { name: 'Libra', symbol: '\u264E', element: 'air' },
  scorpio: { name: 'Escorpiao', symbol: '\u264F', element: 'water' },
  sagittarius: { name: 'Sagitario', symbol: '\u2650', element: 'fire' },
  capricorn: { name: 'Capricornio', symbol: '\u2651', element: 'earth' },
  aquarius: { name: 'Aquario', symbol: '\u2652', element: 'air' },
  pisces: { name: 'Peixes', symbol: '\u2653', element: 'water' },
};

// Helper to get time of day
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// Helper to get greeting message
function getGreetingMessage(timeOfDay: string, name: string): string {
  const greetings = {
    morning: `Bom dia, ${name}!`,
    afternoon: `Boa tarde, ${name}!`,
    evening: `Boa noite, ${name}!`,
    night: `Boa noite, ${name}!`,
  };
  return greetings[timeOfDay as keyof typeof greetings] || `Ola, ${name}!`;
}

// Generate mock horoscope
function generateMockHoroscope(sign: ZodiacSignId): DailyHoroscope {
  const signInfo = zodiacSigns[sign];
  const horoscopes = [
    {
      title: 'Dia de oportunidades',
      preview: 'Hoje e um dia para abrir novos caminhos e aceitar desafios que surgem...',
      fullText: 'Hoje e um dia para abrir novos caminhos e aceitar desafios que surgem em sua vida. O universo conspira a seu favor, trazendo oportunidades que podem transformar sua realidade. Mantenha-se aberto a novas conexoes e nao tenha medo de sair da sua zona de conforto. A Lua em aspecto favoravel com seu signo sugere que suas intuicoes estao especialmente aguadas hoje.',
    },
    {
      title: 'Momento de reflexao',
      preview: 'As estrelas indicam um periodo propicio para olhar para dentro...',
      fullText: 'As estrelas indicam um periodo propicio para olhar para dentro e avaliar seus objetivos de vida. Este e um momento de clareza mental onde decisoes importantes podem ser tomadas com mais sabedoria. Reserve um tempo para meditacao ou simplesmente para ficar em silencio. A energia cosmica favorece o autoconhecimento.',
    },
    {
      title: 'Energia renovada',
      preview: 'Uma onda de energia positiva chega ate voce hoje...',
      fullText: 'Uma onda de energia positiva chega ate voce hoje, renovando seu espirito e trazendo novas perspectivas. Aproveite este momento para iniciar projetos que estavam parados ou retomar habitos saudaveis. Sua vitalidade esta em alta e as pessoas ao seu redor perceberao sua luz radiante.',
    },
  ];

  const randomHoroscope = horoscopes[Math.floor(Math.random() * horoscopes.length)];

  return {
    sign,
    signName: signInfo.name,
    symbol: signInfo.symbol,
    title: randomHoroscope.title,
    preview: randomHoroscope.preview,
    fullText: randomHoroscope.fullText,
    date: new Date().toISOString().split('T')[0],
  };
}

// Generate mock cosmic events
function generateMockCosmicEvents(): CosmicEvent[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Mercurio Retrogrado',
      description: 'Periodo de revisao nas comunicacoes e tecnologia',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntil: 5,
      type: 'retrograde',
      icon: '\u263F',
    },
    {
      id: '2',
      title: 'Lua Cheia em Leao',
      description: 'Momento de expressao criativa e reconhecimento',
      date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntil: 12,
      type: 'full-moon',
      icon: '\uD83C\uDF15',
    },
    {
      id: '3',
      title: 'Conjuncao Venus-Marte',
      description: 'Energia intensa nas relacoes e paixoes',
      date: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntil: 18,
      type: 'conjunction',
      icon: '\u2764',
    },
  ];
}

// Mock API responses for development
function getMockDashboardData(userId: string): DashboardData {
  const timeOfDay = getTimeOfDay();
  const userSign: ZodiacSignId = 'leo'; // Default for demo

  return {
    user: {
      id: userId,
      name: 'Maria',
      gender: 'female',
      birthDate: '1990-08-15',
      sunSign: userSign,
      moonSign: 'cancer',
      risingSign: 'scorpio',
    },
    moon: {
      phase: 'waxing-gibbous' as MoonPhase,
      sign: 'scorpio',
      signName: 'Escorpiao',
      description: 'Energia intensa hoje',
    },
    horoscope: generateMockHoroscope(userSign),
    energy: {
      overall: 80,
      sentiment: 'positive',
      ratings: [
        { category: 'love', label: 'Amor', stars: 4, icon: '\u2764\uFE0F' },
        { category: 'work', label: 'Trabalho', stars: 5, icon: '\uD83D\uDCBC' },
        { category: 'health', label: 'Saude', stars: 3, icon: '\uD83D\uDC9A' },
        { category: 'money', label: 'Dinheiro', stars: 4, icon: '\uD83D\uDCB0' },
      ],
    },
    streak: {
      currentStreak: 5,
      longestStreak: 12,
      lastVisit: new Date().toISOString(),
      isMilestone: false,
    },
    luckyNumbers: {
      numbers: [7, 14, 23],
      generatedAt: new Date().toISOString(),
    },
    cosmicEvents: generateMockCosmicEvents(),
    greeting: {
      timeOfDay,
      message: getGreetingMessage(timeOfDay, 'Maria'),
    },
  };
}

// API Functions
export const dashboardApi = {
  /**
   * Get all dashboard data for a user
   */
  getDailyData: async (userId: string): Promise<DashboardData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return await response.json();
    } catch {
      // Return mock data for development
      console.log('Using mock dashboard data');
      return getMockDashboardData(userId);
    }
  },

  /**
   * Get horoscope for a specific sign
   */
  getHoroscope: async (sign: ZodiacSignId): Promise<DailyHoroscope> => {
    try {
      const response = await fetch(`${API_BASE_URL}/horoscope/${sign}`);
      if (!response.ok) {
        throw new Error('Failed to fetch horoscope');
      }
      return await response.json();
    } catch {
      // Return mock data for development
      console.log('Using mock horoscope data');
      return generateMockHoroscope(sign);
    }
  },

  /**
   * Record a user visit and update streak
   */
  recordVisit: async (userId: string): Promise<StreakInfo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streak/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to record visit');
      }
      return await response.json();
    } catch {
      // Return mock data for development
      console.log('Using mock streak data');
      const storedStreak = localStorage.getItem(`streak_${userId}`);
      const lastVisit = localStorage.getItem(`lastVisit_${userId}`);
      const today = new Date().toDateString();

      let currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;

      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
          currentStreak += 1;
        } else if (lastVisit !== today) {
          currentStreak = 1;
        }

        localStorage.setItem(`streak_${userId}`, currentStreak.toString());
        localStorage.setItem(`lastVisit_${userId}`, today);
      }

      const milestones = [7, 14, 21, 30, 50, 100];
      const isMilestone = milestones.includes(currentStreak);

      return {
        currentStreak,
        longestStreak: Math.max(currentStreak, parseInt(localStorage.getItem(`longestStreak_${userId}`) || '0', 10)),
        lastVisit: new Date().toISOString(),
        isMilestone,
        milestoneMessage: isMilestone ? `Parabens! ${currentStreak} dias seguidos!` : undefined,
      };
    }
  },

  /**
   * Generate new lucky numbers
   */
  regenerateLuckyNumbers: async (userId: string): Promise<LuckyNumbersData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lucky-numbers/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate lucky numbers');
      }
      return await response.json();
    } catch {
      // Generate random numbers locally
      const numbers: number[] = [];
      while (numbers.length < 3) {
        const num = Math.floor(Math.random() * 99) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      return {
        numbers: numbers.sort((a, b) => a - b),
        generatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Get cosmic events
   */
  getCosmicEvents: async (): Promise<CosmicEvent[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cosmic-events`);
      if (!response.ok) {
        throw new Error('Failed to fetch cosmic events');
      }
      return await response.json();
    } catch {
      // Return mock data for development
      console.log('Using mock cosmic events data');
      return generateMockCosmicEvents();
    }
  },
};

export default dashboardApi;
