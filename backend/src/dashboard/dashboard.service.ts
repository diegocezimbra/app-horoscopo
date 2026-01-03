import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AstrologyService } from '../astrology/astrology.service';
import { LunarService } from '../lunar/lunar.service';
import { GamificationService } from '../gamification/gamification.service';
import {
  DashboardDataDto,
  MoonInfoDto,
  DailyHoroscopeDto,
  DailyEnergyDto,
  LuckyNumbersDto,
  CosmicEventDto,
  GreetingDto,
  ZodiacSignId,
} from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  private readonly zodiacNames: Record<ZodiacSignId, { name: string; symbol: string }> = {
    aries: { name: 'Aries', symbol: '\u2648' },
    taurus: { name: 'Touro', symbol: '\u2649' },
    gemini: { name: 'Gemeos', symbol: '\u264A' },
    cancer: { name: 'Cancer', symbol: '\u264B' },
    leo: { name: 'Leao', symbol: '\u264C' },
    virgo: { name: 'Virgem', symbol: '\u264D' },
    libra: { name: 'Libra', symbol: '\u264E' },
    scorpio: { name: 'Escorpiao', symbol: '\u264F' },
    sagittarius: { name: 'Sagitario', symbol: '\u2650' },
    capricorn: { name: 'Capricornio', symbol: '\u2651' },
    aquarius: { name: 'Aquario', symbol: '\u2652' },
    pisces: { name: 'Peixes', symbol: '\u2653' },
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly astrologyService: AstrologyService,
    private readonly lunarService: LunarService,
    private readonly gamificationService: GamificationService,
  ) {}

  /**
   * Get complete dashboard data for a user
   */
  async getDashboardData(userId: string): Promise<DashboardDataDto> {
    // Fetch user profile
    const userProfile = await this.usersService.getProfile(userId);
    const sunSign = userProfile.sunSign as ZodiacSignId;

    // Get greeting based on time of day
    const greeting = this.getGreeting(userProfile.name);

    // Get moon info from lunar service
    const lunarPhase = this.lunarService.getCurrentPhase();
    const moon: MoonInfoDto = {
      phase: lunarPhase.phase.id as any,
      sign: this.getMoonSign(new Date()),
      signName: this.zodiacNames[this.getMoonSign(new Date())]?.name || '',
      description: lunarPhase.phase.energy,
    };

    // Get daily horoscope from astrology service
    const horoscopeData = this.astrologyService.getDailyHoroscope(sunSign as any);
    const horoscope: DailyHoroscopeDto = {
      sign: sunSign,
      signName: this.zodiacNames[sunSign]?.name || sunSign,
      symbol: this.zodiacNames[sunSign]?.symbol || '',
      title: `Horoscopo de ${this.zodiacNames[sunSign]?.name || sunSign}`,
      preview: horoscopeData.general.substring(0, 150) + '...',
      fullText: horoscopeData.general,
      date: new Date().toISOString().split('T')[0],
      energyRating: Math.ceil(horoscopeData.luckyNumber / 20),
    };

    // Calculate energy scores based on horoscope text lengths (as proxy for intensity)
    const loveScore = this.calculateTextScore(horoscopeData.love);
    const careerScore = this.calculateTextScore(horoscopeData.career);
    const healthScore = this.calculateTextScore(horoscopeData.health);

    // Get daily energy ratings
    const energy: DailyEnergyDto = {
      overall: Math.round((loveScore + careerScore + healthScore) / 3),
      sentiment: this.getSentiment(loveScore + careerScore + healthScore),
      ratings: [
        { category: 'love', label: 'Amor', stars: Math.ceil(loveScore / 20), icon: '\u2764\uFE0F' },
        { category: 'work', label: 'Trabalho', stars: Math.ceil(careerScore / 20), icon: '\uD83D\uDCBC' },
        { category: 'health', label: 'Saude', stars: Math.ceil(healthScore / 20), icon: '\uD83D\uDC9A' },
        { category: 'money', label: 'Dinheiro', stars: Math.ceil((careerScore * 0.8 + horoscopeData.luckyNumber * 2) / 20), icon: '\uD83D\uDCB0' },
      ],
    };

    // Get streak info from gamification service
    const streakData = await this.gamificationService.getStreak(userId);

    // Get lucky numbers
    const luckyNumbers = this.generateLuckyNumbers(userId);

    // Get cosmic events
    const cosmicEvents = this.getCosmicEvents();

    return {
      user: {
        id: userProfile.id,
        name: userProfile.name,
        gender: userProfile.gender,
        birthDate: userProfile.birthDate.toISOString().split('T')[0],
        sunSign,
        moonSign: userProfile.moonSign as ZodiacSignId | undefined,
        risingSign: userProfile.ascendant as ZodiacSignId | undefined,
      },
      moon,
      horoscope,
      energy,
      streak: {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastVisit: streakData.lastVisitDate?.toISOString() || new Date().toISOString(),
        isMilestone: this.isMilestone(streakData.currentStreak),
        milestoneMessage: this.getMilestoneMessage(streakData.currentStreak),
      },
      luckyNumbers,
      cosmicEvents,
      greeting,
    };
  }

  /**
   * Generate lucky numbers based on user ID and date
   */
  generateLuckyNumbers(userId: string): LuckyNumbersDto {
    const today = new Date().toISOString().split('T')[0];
    const seed = this.hashCode(userId + today);
    const numbers: number[] = [];

    let current = seed;
    while (numbers.length < 3) {
      current = (current * 1103515245 + 12345) & 0x7fffffff;
      const num = (current % 99) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }

    return {
      numbers: numbers.sort((a, b) => a - b),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get upcoming cosmic events
   */
  getCosmicEvents(): CosmicEventDto[] {
    const now = new Date();
    const events: CosmicEventDto[] = [];

    // Calculate next Mercury retrograde (approximately every 3-4 months)
    const nextRetrograde = this.getNextMercuryRetrograde(now);
    events.push({
      id: 'mercury_retrograde_' + nextRetrograde.toISOString(),
      title: 'Mercurio Retrogrado',
      description: 'Periodo de revisao nas comunicacoes e tecnologia',
      date: nextRetrograde.toISOString(),
      daysUntil: Math.ceil((nextRetrograde.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      type: 'retrograde',
      icon: '\u263F',
    });

    // Calculate next full moon
    const nextFullMoon = this.getNextFullMoon(now);
    const fullMoonSign = this.getMoonSign(nextFullMoon);
    events.push({
      id: 'full_moon_' + nextFullMoon.toISOString(),
      title: `Lua Cheia em ${this.zodiacNames[fullMoonSign]?.name || fullMoonSign}`,
      description: 'Momento de expressao criativa e reconhecimento',
      date: nextFullMoon.toISOString(),
      daysUntil: Math.ceil((nextFullMoon.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      type: 'full-moon',
      icon: '\uD83C\uDF15',
    });

    // Calculate next new moon
    const nextNewMoon = this.getNextNewMoon(now);
    events.push({
      id: 'new_moon_' + nextNewMoon.toISOString(),
      title: 'Lua Nova',
      description: 'Momento ideal para novos comecos e intencoes',
      date: nextNewMoon.toISOString(),
      daysUntil: Math.ceil((nextNewMoon.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      type: 'new-moon',
      icon: '\uD83C\uDF11',
    });

    // Sort by date
    events.sort((a, b) => a.daysUntil - b.daysUntil);

    return events.slice(0, 5);
  }

  /**
   * Get greeting based on time of day
   */
  private getGreeting(name: string): GreetingDto {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    let message: string;

    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
      message = `Bom dia, ${name}!`;
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
      message = `Boa tarde, ${name}!`;
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = 'evening';
      message = `Boa noite, ${name}!`;
    } else {
      timeOfDay = 'night';
      message = `Boa noite, ${name}!`;
    }

    return { timeOfDay, message };
  }

  /**
   * Calculate score from text content
   */
  private calculateTextScore(text: string): number {
    // Base score plus variation based on text characteristics
    const baseScore = 50;
    const positiveWords = ['sucesso', 'amor', 'alegria', 'prosperidade', 'harmonia', 'energia', 'positiv'];
    const negativeWords = ['cuidado', 'atencao', 'evite', 'dificuldade', 'desafio'];

    let score = baseScore;
    const lowerText = text.toLowerCase();

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) score += 10;
    });

    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) score -= 5;
    });

    // Normalize to 0-100 range
    return Math.max(20, Math.min(100, score));
  }

  /**
   * Get sentiment based on overall energy
   */
  private getSentiment(total: number): 'positive' | 'neutral' | 'negative' {
    if (total >= 200) return 'positive';
    if (total >= 100) return 'neutral';
    return 'negative';
  }

  /**
   * Check if streak is a milestone
   */
  private isMilestone(streak: number): boolean {
    const milestones = [7, 14, 21, 30, 50, 100, 365];
    return milestones.includes(streak);
  }

  /**
   * Get milestone message
   */
  private getMilestoneMessage(streak: number): string | undefined {
    if (!this.isMilestone(streak)) return undefined;
    return `Parabens! ${streak} dias seguidos!`;
  }

  /**
   * Simple hash function
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Calculate next Mercury retrograde date
   */
  private getNextMercuryRetrograde(from: Date): Date {
    // Mercury retrogrades happen approximately every 88 days
    // Using a simplified calculation
    const baseDate = new Date('2024-04-01'); // Known retrograde start
    const retrogradeInterval = 116 * 24 * 60 * 60 * 1000; // ~116 days between retrogrades

    let nextRetrograde = new Date(baseDate);
    while (nextRetrograde <= from) {
      nextRetrograde = new Date(nextRetrograde.getTime() + retrogradeInterval);
    }

    return nextRetrograde;
  }

  /**
   * Calculate next full moon date
   */
  private getNextFullMoon(from: Date): Date {
    // Lunar cycle is approximately 29.53 days
    const lunarCycle = 29.53 * 24 * 60 * 60 * 1000;
    const knownFullMoon = new Date('2024-01-25'); // Known full moon

    let nextFullMoon = new Date(knownFullMoon);
    while (nextFullMoon <= from) {
      nextFullMoon = new Date(nextFullMoon.getTime() + lunarCycle);
    }

    return nextFullMoon;
  }

  /**
   * Calculate next new moon date
   */
  private getNextNewMoon(from: Date): Date {
    const lunarCycle = 29.53 * 24 * 60 * 60 * 1000;
    const knownNewMoon = new Date('2024-01-11'); // Known new moon

    let nextNewMoon = new Date(knownNewMoon);
    while (nextNewMoon <= from) {
      nextNewMoon = new Date(nextNewMoon.getTime() + lunarCycle);
    }

    return nextNewMoon;
  }

  /**
   * Get moon sign for a given date
   */
  private getMoonSign(date: Date): ZodiacSignId {
    // Simplified calculation - moon changes sign every ~2.5 days
    const signs: ZodiacSignId[] = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const signIndex = Math.floor((dayOfYear * 12) / 365) % 12;
    return signs[signIndex];
  }
}
