import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStreak } from '../entities/user-streak.entity';
import { StreakInfoDto, StreakUpdateDto, FreezeResultDto } from '../dto/gamification.dto';
import { STREAK_MILESTONES, XP_REWARDS } from '../data/achievements.data';

/**
 * StreaksService handles daily visit tracking and streak management
 * Inspired by Duolingo's streak system for user retention
 */
@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  constructor(
    @InjectRepository(UserStreak)
    private readonly streakRepository: Repository<UserStreak>,
  ) {}

  /**
   * Get or create a user's streak record
   */
  async getOrCreateStreak(userId: string): Promise<UserStreak> {
    let streak = await this.streakRepository.findOne({ where: { userId } });

    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        freezesAvailable: 1, // Start with one free freeze
        totalVisits: 0,
      });
      await this.streakRepository.save(streak);
      this.logger.log(`Created new streak record for user ${userId}`);
    }

    return streak;
  }

  /**
   * Record a daily visit and update streak
   */
  async recordVisit(userId: string): Promise<StreakUpdateDto> {
    const streak = await this.getOrCreateStreak(userId);
    const today = this.getToday();
    const lastVisit = streak.lastVisitDate ? new Date(streak.lastVisitDate) : null;

    const previousStreak = streak.currentStreak;
    let achievementsUnlocked: string[] = [];
    let milestoneReached: number | null = null;
    let xpEarned = 0;

    // Check if already visited today
    if (lastVisit && this.isSameDay(lastVisit, today)) {
      return {
        previousStreak,
        currentStreak: streak.currentStreak,
        isNewRecord: false,
        streakMaintained: true,
        streakIncreased: false,
        milestoneReached: null,
        xpEarned: 0,
        achievementsUnlocked: [],
      };
    }

    // Check streak continuity
    const isConsecutive = lastVisit && this.isYesterday(lastVisit, today);
    const usedFreeze = streak.usedFreezeToday;

    if (isConsecutive || usedFreeze) {
      // Continue streak
      streak.currentStreak += 1;
      streak.usedFreezeToday = false;

      // Calculate XP with streak bonus
      const streakBonus = Math.min(streak.currentStreak * XP_REWARDS.streak_bonus_multiplier, 1);
      xpEarned = Math.floor(XP_REWARDS.daily_visit * (1 + streakBonus));

      // Check milestones
      if (STREAK_MILESTONES.includes(streak.currentStreak)) {
        milestoneReached = streak.currentStreak;
        achievementsUnlocked.push(`streak_${streak.currentStreak}`);
      }
    } else if (!lastVisit) {
      // First visit ever
      streak.currentStreak = 1;
      xpEarned = XP_REWARDS.daily_visit + XP_REWARDS.first_of_day_bonus;
    } else {
      // Streak broken - start fresh
      streak.currentStreak = 1;
      streak.usedFreezeToday = false;
      xpEarned = XP_REWARDS.daily_visit;
    }

    // Update longest streak
    const isNewRecord = streak.currentStreak > streak.longestStreak;
    if (isNewRecord) {
      streak.longestStreak = streak.currentStreak;
    }

    // Update visit info
    streak.lastVisitDate = today;
    streak.totalVisits += 1;

    await this.streakRepository.save(streak);

    this.logger.log(
      `User ${userId} recorded visit. Streak: ${previousStreak} -> ${streak.currentStreak}`,
    );

    return {
      previousStreak,
      currentStreak: streak.currentStreak,
      isNewRecord,
      streakMaintained: isConsecutive || usedFreeze,
      streakIncreased: streak.currentStreak > previousStreak,
      milestoneReached,
      xpEarned,
      achievementsUnlocked,
    };
  }

  /**
   * Get user's current streak information
   */
  async getStreak(userId: string): Promise<StreakInfoDto> {
    const streak = await this.getOrCreateStreak(userId);
    const today = this.getToday();
    const lastVisit = streak.lastVisitDate ? new Date(streak.lastVisitDate) : null;

    // Check if streak is at risk (hasn't visited today and hasn't visited yesterday)
    let streakAtRisk = false;
    if (lastVisit && streak.currentStreak > 0) {
      const isToday = this.isSameDay(lastVisit, today);
      const isYesterday = this.isYesterday(lastVisit, today);
      streakAtRisk = !isToday && isYesterday;
    }

    // Find next milestone
    const nextMilestone = STREAK_MILESTONES.find((m) => m > streak.currentStreak) || null;
    const daysToNextMilestone = nextMilestone ? nextMilestone - streak.currentStreak : 0;

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastVisitDate: streak.lastVisitDate,
      freezesAvailable: streak.freezesAvailable,
      usedFreezeToday: streak.usedFreezeToday,
      totalVisits: streak.totalVisits,
      streakAtRisk,
      nextMilestone,
      daysToNextMilestone,
    };
  }

  /**
   * Use a streak freeze to protect the streak
   */
  async useFreeze(userId: string): Promise<FreezeResultDto> {
    const streak = await this.getOrCreateStreak(userId);

    if (streak.freezesAvailable <= 0) {
      return {
        success: false,
        freezesRemaining: 0,
        streakProtected: false,
        message: 'Voce nao tem protecoes de streak disponiveis',
      };
    }

    if (streak.usedFreezeToday) {
      return {
        success: false,
        freezesRemaining: streak.freezesAvailable,
        streakProtected: true,
        message: 'Voce ja usou uma protecao hoje',
      };
    }

    // Use the freeze
    streak.freezesAvailable -= 1;
    streak.usedFreezeToday = true;
    await this.streakRepository.save(streak);

    this.logger.log(`User ${userId} used streak freeze. Remaining: ${streak.freezesAvailable}`);

    return {
      success: true,
      freezesRemaining: streak.freezesAvailable,
      streakProtected: true,
      message: `Streak protegido! Voce tem ${streak.freezesAvailable} protecoes restantes`,
    };
  }

  /**
   * Add freezes to a user (reward from achievements, purchases, etc.)
   */
  async addFreezes(userId: string, amount: number): Promise<number> {
    const streak = await this.getOrCreateStreak(userId);
    streak.freezesAvailable += amount;
    await this.streakRepository.save(streak);

    this.logger.log(`Added ${amount} freezes to user ${userId}. Total: ${streak.freezesAvailable}`);

    return streak.freezesAvailable;
  }

  /**
   * Check and break streak if user missed a day (called by cron job)
   */
  async checkAndBreakStreak(userId: string): Promise<void> {
    const streak = await this.streakRepository.findOne({ where: { userId } });

    if (!streak || !streak.lastVisitDate || streak.currentStreak === 0) {
      return;
    }

    const today = this.getToday();
    const lastVisit = new Date(streak.lastVisitDate);
    const daysSinceVisit = this.getDaysDifference(lastVisit, today);

    // If more than 1 day since last visit and no freeze was used
    if (daysSinceVisit > 1 && !streak.usedFreezeToday) {
      this.logger.log(
        `Breaking streak for user ${userId}. Was ${streak.currentStreak} days, last visit ${daysSinceVisit} days ago`,
      );
      streak.currentStreak = 0;
      await this.streakRepository.save(streak);
    }
  }

  /**
   * Reset daily freeze flags (called by cron at midnight)
   */
  async resetDailyFlags(): Promise<void> {
    await this.streakRepository.update({ usedFreezeToday: true }, { usedFreezeToday: false });
    this.logger.log('Reset daily freeze flags for all users');
  }

  // ==================== HELPER METHODS ====================

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isYesterday(date: Date, today: Date): boolean {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return this.isSameDay(date, yesterday);
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
  }
}
