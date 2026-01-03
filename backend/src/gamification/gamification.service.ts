import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StreaksService } from './services/streaks.service';
import { AchievementsService } from './services/achievements.service';
import { XPService } from './services/xp.service';
import { LeaderboardService } from './services/leaderboard.service';
import {
  GamificationProfileDto,
  StreakUpdateDto,
  StreakInfoDto,
  FreezeResultDto,
  AchievementDto,
  UserAchievementDto,
  AchievementProgressDto,
  XPInfoDto,
  XPUpdateDto,
  LeaderboardEntryDto,
  RankInfoDto,
} from './dto/gamification.dto';
import { XP_REWARDS } from './data/achievements.data';

/**
 * GamificationService orchestrates all gamification features
 * Main entry point for gamification functionality
 */
@Injectable()
export class GamificationService implements OnModuleInit {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly streaksService: StreaksService,
    private readonly achievementsService: AchievementsService,
    private readonly xpService: XPService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  /**
   * Initialize achievements on module startup
   */
  async onModuleInit(): Promise<void> {
    await this.achievementsService.initializeAchievements();
    this.logger.log('Gamification system initialized');
  }

  // ==================== MAIN PROFILE ====================

  /**
   * Get complete gamification profile for a user
   */
  async getProfile(userId: string): Promise<GamificationProfileDto> {
    const [streak, xp, rank, achievements, counts, unseenCount] = await Promise.all([
      this.streaksService.getStreak(userId),
      this.xpService.getXPInfo(userId),
      this.leaderboardService.getUserRank(userId),
      this.achievementsService.getUserAchievements(userId),
      this.achievementsService.getAchievementCounts(userId),
      this.achievementsService.getUnseenCount(userId),
    ]);

    // Get progress for next achievements
    const allProgress = await this.achievementsService.getProgress(userId);
    const nextAchievements = allProgress
      .filter((p) => !p.isUnlocked && p.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    return {
      userId,
      streak,
      xp,
      rank,
      recentAchievements: achievements.slice(0, 5),
      totalAchievements: counts.total,
      unlockedAchievements: counts.unlocked,
      nextAchievements,
      unseenAchievements: unseenCount,
    };
  }

  // ==================== DAILY VISIT ====================

  /**
   * Record a daily visit and process all related gamification
   */
  async recordDailyVisit(userId: string): Promise<{
    streak: StreakUpdateDto;
    xp: XPUpdateDto | null;
    achievements: AchievementDto[];
  }> {
    // Record the visit
    const streakUpdate = await this.streaksService.recordVisit(userId);

    // Add XP for the visit
    let xpUpdate: XPUpdateDto | null = null;
    if (streakUpdate.xpEarned > 0) {
      xpUpdate = await this.xpService.addXP(userId, streakUpdate.xpEarned, 'Visita diaria');
    }

    // Check for streak achievements
    const achievements: AchievementDto[] = [];
    for (const achievementKey of streakUpdate.achievementsUnlocked) {
      const achievement = await this.achievementsService.awardAchievement(userId, achievementKey);
      if (achievement) {
        achievements.push(achievement);
      }
    }

    this.logger.log(
      `User ${userId} daily visit processed. Streak: ${streakUpdate.currentStreak}, XP: ${xpUpdate?.xpAdded || 0}`,
    );

    return {
      streak: streakUpdate,
      xp: xpUpdate,
      achievements,
    };
  }

  // ==================== STREAKS ====================

  /**
   * Get user's streak info
   */
  async getStreak(userId: string): Promise<StreakInfoDto> {
    return this.streaksService.getStreak(userId);
  }

  /**
   * Use a streak freeze
   */
  async useFreeze(userId: string): Promise<FreezeResultDto> {
    return this.streaksService.useFreeze(userId);
  }

  // ==================== ACHIEVEMENTS ====================

  /**
   * Track an action and potentially award achievements
   */
  async trackAction(
    userId: string,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<{
    achievement: AchievementDto | null;
    xp: XPUpdateDto | null;
  }> {
    // Check for achievements
    const achievement = await this.achievementsService.checkAndAward(userId, action, metadata);

    // Award XP based on action
    let xpUpdate: XPUpdateDto | null = null;
    const xpAmount = this.getXPForAction(action);
    if (xpAmount > 0) {
      xpUpdate = await this.xpService.addXP(userId, xpAmount, this.getXPReasonForAction(action));
    }

    return { achievement, xp: xpUpdate };
  }

  /**
   * Get all achievements (for display)
   */
  async getAllAchievements(): Promise<AchievementDto[]> {
    return this.achievementsService.getAllAchievements();
  }

  /**
   * Get user's achievements
   */
  async getUserAchievements(userId: string): Promise<UserAchievementDto[]> {
    return this.achievementsService.getUserAchievements(userId);
  }

  /**
   * Get achievement progress for a user
   */
  async getAchievementProgress(
    userId: string,
    progressData?: Record<string, { current: number; target: number }>,
  ): Promise<AchievementProgressDto[]> {
    return this.achievementsService.getProgress(userId, progressData);
  }

  /**
   * Mark achievements as seen
   */
  async markAchievementsSeen(userId: string, achievementIds?: string[]): Promise<void> {
    return this.achievementsService.markAsSeen(userId, achievementIds);
  }

  // ==================== XP ====================

  /**
   * Get user's XP info
   */
  async getXPInfo(userId: string): Promise<XPInfoDto> {
    return this.xpService.getXPInfo(userId);
  }

  /**
   * Manually add XP (for admin or special rewards)
   */
  async addXP(userId: string, amount: number, reason: string): Promise<XPUpdateDto> {
    return this.xpService.addXP(userId, amount, reason);
  }

  // ==================== LEADERBOARD ====================

  /**
   * Get leaderboard by type
   */
  async getLeaderboard(
    type: 'weekly' | 'monthly' | 'alltime' = 'weekly',
    limit = 10,
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    switch (type) {
      case 'weekly':
        return this.leaderboardService.getWeeklyLeaderboard(limit, currentUserId);
      case 'monthly':
        return this.leaderboardService.getMonthlyLeaderboard(limit, currentUserId);
      case 'alltime':
        return this.leaderboardService.getAllTimeLeaderboard(limit, currentUserId);
      default:
        return this.leaderboardService.getWeeklyLeaderboard(limit, currentUserId);
    }
  }

  /**
   * Get user's rank info
   */
  async getUserRank(userId: string): Promise<RankInfoDto> {
    return this.leaderboardService.getUserRank(userId);
  }

  /**
   * Get streak leaderboard
   */
  async getStreakLeaderboard(limit = 10, currentUserId?: string): Promise<LeaderboardEntryDto[]> {
    return this.leaderboardService.getStreakLeaderboard(limit, currentUserId);
  }

  /**
   * Get user's position in context
   */
  async getUserLeaderboardContext(userId: string): Promise<LeaderboardEntryDto[]> {
    return this.leaderboardService.getUserContext(userId);
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get XP amount for an action
   */
  private getXPForAction(action: string): number {
    const xpMap: Record<string, number> = {
      read_horoscope: XP_REWARDS.read_horoscope,
      read_sign_info: XP_REWARDS.read_sign_info,
      compatibility_check: XP_REWARDS.check_compatibility,
      share: XP_REWARDS.share_content,
      quiz_complete: XP_REWARDS.complete_quiz,
      add_profile: XP_REWARDS.add_profile,
    };

    return xpMap[action] || 0;
  }

  /**
   * Get human-readable reason for XP gain
   */
  private getXPReasonForAction(action: string): string {
    const reasonMap: Record<string, string> = {
      read_horoscope: 'Leitura de horoscopo',
      read_sign_info: 'Leitura sobre signos',
      compatibility_check: 'Analise de compatibilidade',
      share: 'Compartilhamento',
      quiz_complete: 'Quiz completado',
      add_profile: 'Perfil adicionado',
    };

    return reasonMap[action] || 'Acao';
  }
}
