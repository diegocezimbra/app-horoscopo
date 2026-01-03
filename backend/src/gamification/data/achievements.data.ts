/**
 * Achievement definition structure
 */
export interface AchievementDefinition {
  name: string;
  description: string;
  xp: number;
  icon: string;
  category: 'onboarding' | 'streak' | 'features' | 'social' | 'exploration' | 'premium';
  isSecret?: boolean;
  sortOrder?: number;
}

/**
 * All available achievements in the gamification system
 * These define what users can unlock through various actions
 */
export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  // ==================== ONBOARDING ====================
  first_reading: {
    name: 'Primeira Leitura',
    description: 'Completou seu primeiro mapa astral',
    xp: 100,
    icon: '🌟',
    category: 'onboarding',
    sortOrder: 1,
  },
  profile_complete: {
    name: 'Perfil Completo',
    description: 'Preencheu todas as informacoes do perfil',
    xp: 75,
    icon: '✨',
    category: 'onboarding',
    sortOrder: 2,
  },
  quiz_complete: {
    name: 'Autoconhecimento',
    description: 'Completou o quiz de personalidade',
    xp: 50,
    icon: '🧠',
    category: 'onboarding',
    sortOrder: 3,
  },

  // ==================== STREAKS ====================
  streak_3: {
    name: 'Iniciante Cosmico',
    description: '3 dias seguidos de acesso',
    xp: 50,
    icon: '🔥',
    category: 'streak',
    sortOrder: 10,
  },
  streak_7: {
    name: 'Semana Cosmica',
    description: '7 dias seguidos de acesso',
    xp: 200,
    icon: '🔥',
    category: 'streak',
    sortOrder: 11,
  },
  streak_14: {
    name: 'Quinzena Estelar',
    description: '14 dias seguidos de acesso',
    xp: 350,
    icon: '⚡',
    category: 'streak',
    sortOrder: 12,
  },
  streak_30: {
    name: 'Mes Estelar',
    description: '30 dias seguidos de acesso',
    xp: 500,
    icon: '⭐',
    category: 'streak',
    sortOrder: 13,
  },
  streak_60: {
    name: 'Dedicacao Lunar',
    description: '60 dias seguidos de acesso',
    xp: 750,
    icon: '🌙',
    category: 'streak',
    sortOrder: 14,
  },
  streak_100: {
    name: 'Centuriao Astral',
    description: '100 dias seguidos de acesso',
    xp: 1000,
    icon: '💫',
    category: 'streak',
    sortOrder: 15,
  },
  streak_365: {
    name: 'Guardiao do Zodiaco',
    description: '365 dias seguidos de acesso',
    xp: 5000,
    icon: '🏆',
    category: 'streak',
    isSecret: true,
    sortOrder: 16,
  },

  // ==================== FEATURES ====================
  first_compatibility: {
    name: 'Match Maker',
    description: 'Realizou sua primeira analise de compatibilidade',
    xp: 50,
    icon: '💕',
    category: 'features',
    sortOrder: 20,
  },
  compatibility_5: {
    name: 'Conselheiro Romantico',
    description: 'Realizou 5 analises de compatibilidade',
    xp: 100,
    icon: '💖',
    category: 'features',
    sortOrder: 21,
  },
  compatibility_master: {
    name: 'Cupido',
    description: 'Realizou 10 analises de compatibilidade',
    xp: 200,
    icon: '💘',
    category: 'features',
    sortOrder: 22,
  },
  first_transit: {
    name: 'Observador de Transitos',
    description: 'Consultou seu primeiro transito planetario',
    xp: 50,
    icon: '🪐',
    category: 'features',
    sortOrder: 23,
  },
  first_horoscope: {
    name: 'Leitor Diario',
    description: 'Leu seu primeiro horoscopo diario',
    xp: 25,
    icon: '📖',
    category: 'features',
    sortOrder: 24,
  },
  horoscope_week: {
    name: 'Leitor Dedicado',
    description: 'Leu o horoscopo por 7 dias seguidos',
    xp: 100,
    icon: '📚',
    category: 'features',
    sortOrder: 25,
  },

  // ==================== SOCIAL ====================
  first_share: {
    name: 'Evangelista',
    description: 'Compartilhou seu primeiro conteudo',
    xp: 100,
    icon: '📤',
    category: 'social',
    sortOrder: 30,
  },
  share_5: {
    name: 'Influenciador',
    description: 'Compartilhou 5 conteudos',
    xp: 200,
    icon: '📣',
    category: 'social',
    sortOrder: 31,
  },
  first_friend: {
    name: 'Conexao Cosmica',
    description: 'Adicionou seu primeiro amigo',
    xp: 75,
    icon: '🤝',
    category: 'social',
    sortOrder: 32,
  },
  profile_collector_5: {
    name: 'Colecionador',
    description: 'Adicionou 5 perfis de amigos/familiares',
    xp: 150,
    icon: '👥',
    category: 'social',
    sortOrder: 33,
  },
  profile_collector_10: {
    name: 'Rede Estelar',
    description: 'Adicionou 10 perfis de amigos/familiares',
    xp: 300,
    icon: '🌐',
    category: 'social',
    sortOrder: 34,
  },
  invite_friend: {
    name: 'Embaixador',
    description: 'Convidou um amigo que se cadastrou',
    xp: 250,
    icon: '🎁',
    category: 'social',
    sortOrder: 35,
  },

  // ==================== EXPLORATION ====================
  all_signs_read: {
    name: 'Zodiaco Completo',
    description: 'Leu sobre todos os 12 signos',
    xp: 300,
    icon: '♈',
    category: 'exploration',
    sortOrder: 40,
  },
  all_houses_read: {
    name: 'Explorador das Casas',
    description: 'Leu sobre todas as 12 casas astrologicas',
    xp: 300,
    icon: '🏠',
    category: 'exploration',
    sortOrder: 41,
  },
  all_planets_read: {
    name: 'Viajante Planetario',
    description: 'Leu sobre todos os planetas',
    xp: 250,
    icon: '🌍',
    category: 'exploration',
    sortOrder: 42,
  },
  numerology_complete: {
    name: 'Numerologo',
    description: 'Completou sua analise numerologica completa',
    xp: 150,
    icon: '🔢',
    category: 'exploration',
    sortOrder: 43,
  },
  first_retrograde: {
    name: 'Sobrevivente de Retrogrado',
    description: 'Consultou informacoes durante um Mercurio retrogrado',
    xp: 75,
    icon: '🔄',
    category: 'exploration',
    isSecret: true,
    sortOrder: 44,
  },
  eclipse_reader: {
    name: 'Cacador de Eclipses',
    description: 'Leu sobre um eclipse',
    xp: 100,
    icon: '🌑',
    category: 'exploration',
    sortOrder: 45,
  },

  // ==================== PREMIUM ====================
  premium_member: {
    name: 'VIP Cosmico',
    description: 'Tornou-se membro premium',
    xp: 500,
    icon: '👑',
    category: 'premium',
    sortOrder: 50,
  },
  ultimate_member: {
    name: 'Mestre do Universo',
    description: 'Tornou-se membro ultimate',
    xp: 1000,
    icon: '🌌',
    category: 'premium',
    sortOrder: 51,
  },
  first_premium_feature: {
    name: 'Primeiras Estrelas',
    description: 'Usou sua primeira funcionalidade premium',
    xp: 100,
    icon: '💎',
    category: 'premium',
    sortOrder: 52,
  },
  yearly_subscriber: {
    name: 'Compromisso Anual',
    description: 'Assinou o plano anual',
    xp: 750,
    icon: '📅',
    category: 'premium',
    isSecret: true,
    sortOrder: 53,
  },
};

/**
 * Streak milestone thresholds
 */
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365];

/**
 * Level titles based on level ranges
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novato Cosmico',
  5: 'Aprendiz Estelar',
  10: 'Estudante das Estrelas',
  15: 'Conhecedor Astral',
  20: 'Adepto do Zodiaco',
  30: 'Especialista Celestial',
  40: 'Mestre Astrologico',
  50: 'Sabio do Universo',
  60: 'Oraculo Cosmico',
  75: 'Guardiao das Estrelas',
  90: 'Iluminado Celestial',
  100: 'Lenda do Zodiaco',
};

/**
 * XP rewards for various actions
 */
export const XP_REWARDS = {
  daily_visit: 10,
  streak_bonus_multiplier: 0.1, // +10% per streak day, max 100%
  read_horoscope: 5,
  read_sign_info: 5,
  check_compatibility: 15,
  share_content: 20,
  complete_quiz: 25,
  add_profile: 10,
  first_of_day_bonus: 5,
};
