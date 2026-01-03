import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserXP, XPEntry } from '../entities/user-xp.entity';
import { XPInfoDto, XPUpdateDto } from '../dto/gamification.dto';
import { LEVEL_TITLES } from '../data/achievements.data';

/**
 * XPService handles experience points and leveling system
 * Provides extrinsic motivation through progression
 */
@Injectable()
export class XPService {
  private readonly logger = new Logger(XPService.name);

  // XP required for each level follows a curve: level^2 * 100
  // Level 1: 100 XP, Level 2: 400 XP, Level 5: 2500 XP, Level 10: 10000 XP
  private readonly XP_MULTIPLIER = 100;
  private readonly MAX_LEVEL = 100;
  private readonly MAX_HISTORY_ENTRIES = 50; // Keep last 50 XP entries

  constructor(
    @InjectRepository(UserXP)
    private readonly xpRepository: Repository<UserXP>,
  ) {}

  /**
   * Get or create a user's XP record
   */
  async getOrCreateXP(userId: string): Promise<UserXP> {
    let userXp = await this.xpRepository.findOne({ where: { userId } });

    if (!userXp) {
      userXp = this.xpRepository.create({
        userId,
        totalXp: 0,
        level: 1,
        xpHistory: [],
        weeklyXp: 0,
        monthlyXp: 0,
      });
      await this.xpRepository.save(userXp);
      this.logger.log(`Created new XP record for user ${userId}`);
    }

    // Check and reset weekly/monthly XP if needed
    await this.checkAndResetPeriodXP(userXp);

    return userXp;
  }

  /**
   * Add XP to a user and handle leveling
   */
  async addXP(userId: string, amount: number, reason: string): Promise<XPUpdateDto> {
    const userXp = await this.getOrCreateXP(userId);
    const previousXp = userXp.totalXp;
    const previousLevel = userXp.level;

    // Add XP
    userXp.totalXp += amount;
    userXp.weeklyXp += amount;
    userXp.monthlyXp += amount;

    // Add to history
    const xpEntry: XPEntry = {
      amount,
      reason,
      timestamp: new Date(),
    };
    userXp.xpHistory = [...(userXp.xpHistory || []).slice(-this.MAX_HISTORY_ENTRIES + 1), xpEntry];

    // Calculate new level
    const newLevel = this.calculateLevel(userXp.totalXp);
    const leveledUp = newLevel > previousLevel;
    userXp.level = newLevel;

    await this.xpRepository.save(userXp);

    if (leveledUp) {
      this.logger.log(
        `User ${userId} leveled up! ${previousLevel} -> ${newLevel} (${userXp.totalXp} XP)`,
      );
    }

    return {
      previousXp,
      xpAdded: amount,
      totalXp: userXp.totalXp,
      previousLevel,
      currentLevel: newLevel,
      leveledUp,
      newLevelTitle: leveledUp ? this.getLevelTitle(newLevel) : null,
      reason,
    };
  }

  /**
   * Get detailed XP information for a user
   */
  async getXPInfo(userId: string): Promise<XPInfoDto> {
    const userXp = await this.getOrCreateXP(userId);

    const xpForCurrentLevel = this.getXPForLevel(userXp.level);
    const xpForNextLevel = this.getXPForLevel(userXp.level + 1);
    const xpProgressInLevel = userXp.totalXp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

    return {
      totalXp: userXp.totalXp,
      level: userXp.level,
      levelTitle: this.getLevelTitle(userXp.level),
      xpForCurrentLevel,
      xpForNextLevel,
      xpProgressInLevel,
      percentToNextLevel:
        userXp.level >= this.MAX_LEVEL
          ? 100
          : Math.floor((xpProgressInLevel / xpNeededForNextLevel) * 100),
      weeklyXp: userXp.weeklyXp,
      monthlyXp: userXp.monthlyXp,
    };
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXp: number): number {
    // Level = floor(sqrt(xp / 100))
    // But minimum is 1, maximum is MAX_LEVEL
    const rawLevel = Math.floor(Math.sqrt(totalXp / this.XP_MULTIPLIER));
    return Math.min(Math.max(rawLevel, 1), this.MAX_LEVEL);
  }

  /**
   * Get XP required to reach a specific level
   */
  getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return level * level * this.XP_MULTIPLIER;
  }

  /**
   * Get XP needed to reach the next level from current level
   */
  getXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= this.MAX_LEVEL) return 0;
    const currentLevelXP = this.getXPForLevel(currentLevel);
    const nextLevelXP = this.getXPForLevel(currentLevel + 1);
    return nextLevelXP - currentLevelXP;
  }

  /**
   * Get the title for a given level
   */
  getLevelTitle(level: number): string {
    // Find the highest threshold that's <= the current level
    const thresholds = Object.keys(LEVEL_TITLES)
      .map(Number)
      .sort((a, b) => b - a);

    for (const threshold of thresholds) {
      if (level >= threshold) {
        return LEVEL_TITLES[threshold];
      }
    }

    return LEVEL_TITLES[1]; // Default to first title
  }

  /**
   * Get XP history for a user
   */
  async getXPHistory(userId: string, limit = 20): Promise<XPEntry[]> {
    const userXp = await this.getOrCreateXP(userId);
    return (userXp.xpHistory || []).slice(-limit).reverse();
  }

  /**
   * Check and reset weekly/monthly XP counters
   */
  private async checkAndResetPeriodXP(userXp: UserXP): Promise<void> {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let needsUpdate = false;

    // Check weekly reset
    if (!userXp.lastWeekReset || new Date(userXp.lastWeekReset) < startOfWeek) {
      userXp.weeklyXp = 0;
      userXp.lastWeekReset = startOfWeek;
      needsUpdate = true;
    }

    // Check monthly reset
    if (!userXp.lastMonthReset || new Date(userXp.lastMonthReset) < startOfMonth) {
      userXp.monthlyXp = 0;
      userXp.lastMonthReset = startOfMonth;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await this.xpRepository.save(userXp);
    }
  }

  /**
   * Get the start of the current week (Sunday)
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
