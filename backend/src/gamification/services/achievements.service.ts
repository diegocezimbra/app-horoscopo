import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import {
  AchievementDto,
  UserAchievementDto,
  AchievementProgressDto,
} from '../dto/gamification.dto';
import { ACHIEVEMENTS, AchievementDefinition } from '../data/achievements.data';
import { XPService } from './xp.service';

/**
 * AchievementsService manages achievement definitions and user unlocks
 * Provides intrinsic motivation through accomplishments
 */
@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
    @Inject(forwardRef(() => XPService))
    private readonly xpService: XPService,
  ) {}

  /**
   * Initialize achievements in database from data file
   * Should be called on app startup
   */
  async initializeAchievements(): Promise<void> {
    for (const [key, data] of Object.entries(ACHIEVEMENTS)) {
      const exists = await this.achievementRepository.findOne({ where: { key } });

      if (!exists) {
        const achievement = this.achievementRepository.create({
          key,
          name: data.name,
          description: data.description,
          xpReward: data.xp,
          icon: data.icon,
          category: data.category,
          isSecret: data.isSecret || false,
          sortOrder: data.sortOrder || 0,
        });
        await this.achievementRepository.save(achievement);
        this.logger.log(`Created achievement: ${key}`);
      }
    }
    this.logger.log('Achievement initialization complete');
  }

  /**
   * Check if user should receive an achievement based on action
   */
  async checkAndAward(
    userId: string,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<AchievementDto | null> {
    // Get the achievement key based on the action
    const achievementKey = this.getAchievementKeyForAction(action, metadata);

    if (!achievementKey) {
      return null;
    }

    return this.awardAchievement(userId, achievementKey);
  }

  /**
   * Directly award an achievement to a user
   */
  async awardAchievement(userId: string, achievementKey: string): Promise<AchievementDto | null> {
    // Check if achievement exists
    const achievement = await this.achievementRepository.findOne({
      where: { key: achievementKey },
    });

    if (!achievement) {
      this.logger.warn(`Achievement ${achievementKey} not found`);
      return null;
    }

    // Check if user already has this achievement
    const existing = await this.userAchievementRepository.findOne({
      where: { userId, achievementId: achievement.id },
    });

    if (existing) {
      return null; // Already has achievement
    }

    // Award the achievement
    const userAchievement = this.userAchievementRepository.create({
      userId,
      achievementId: achievement.id,
      seen: false,
    });
    await this.userAchievementRepository.save(userAchievement);

    // Award XP for the achievement
    await this.xpService.addXP(userId, achievement.xpReward, `Conquista: ${achievement.name}`);

    this.logger.log(`User ${userId} unlocked achievement: ${achievement.name}`);

    return {
      id: achievement.id,
      key: achievement.key,
      name: achievement.name,
      description: achievement.description,
      xpReward: achievement.xpReward,
      icon: achievement.icon,
      category: achievement.category,
      isSecret: achievement.isSecret,
    };
  }

  /**
   * Get all achievements a user has unlocked
   */
  async getUserAchievements(userId: string): Promise<UserAchievementDto[]> {
    const userAchievements = await this.userAchievementRepository.find({
      where: { userId },
      order: { unlockedAt: 'DESC' },
    });

    return userAchievements.map((ua) => ({
      id: ua.id,
      achievement: {
        id: ua.achievement.id,
        key: ua.achievement.key,
        name: ua.achievement.name,
        description: ua.achievement.description,
        xpReward: ua.achievement.xpReward,
        icon: ua.achievement.icon,
        category: ua.achievement.category,
        isSecret: ua.achievement.isSecret,
      },
      unlockedAt: ua.unlockedAt,
      seen: ua.seen,
    }));
  }

  /**
   * Get all available achievements with progress
   */
  async getProgress(
    userId: string,
    progressData?: Record<string, { current: number; target: number }>,
  ): Promise<AchievementProgressDto[]> {
    const allAchievements = await this.achievementRepository.find({
      order: { sortOrder: 'ASC' },
    });

    const userAchievements = await this.userAchievementRepository.find({
      where: { userId },
    });

    const unlockedKeys = new Set(userAchievements.map((ua) => ua.achievement.key));
    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievement.key, ua.unlockedAt]),
    );

    return allAchievements
      .filter((a) => !a.isSecret || unlockedKeys.has(a.key))
      .map((achievement) => {
        const isUnlocked = unlockedKeys.has(achievement.key);
        const progress = progressData?.[achievement.key];

        return {
          achievement: {
            id: achievement.id,
            key: achievement.key,
            name: achievement.name,
            description: achievement.description,
            xpReward: achievement.xpReward,
            icon: achievement.icon,
            category: achievement.category,
            isSecret: achievement.isSecret,
          },
          isUnlocked,
          unlockedAt: unlockedMap.get(achievement.key) || null,
          progress: isUnlocked
            ? 100
            : progress
              ? Math.floor((progress.current / progress.target) * 100)
              : 0,
          currentValue: progress?.current || null,
          targetValue: progress?.target || null,
        };
      });
  }

  /**
   * Get count of unseen achievements
   */
  async getUnseenCount(userId: string): Promise<number> {
    return this.userAchievementRepository.count({
      where: { userId, seen: false },
    });
  }

  /**
   * Mark achievements as seen
   */
  async markAsSeen(userId: string, achievementIds?: string[]): Promise<void> {
    if (achievementIds && achievementIds.length > 0) {
      await this.userAchievementRepository.update(
        { userId, id: achievementIds as any },
        { seen: true },
      );
    } else {
      await this.userAchievementRepository.update({ userId, seen: false }, { seen: true });
    }
  }

  /**
   * Get all achievement definitions
   */
  async getAllAchievements(includeSecret = false): Promise<AchievementDto[]> {
    const achievements = await this.achievementRepository.find({
      where: includeSecret ? {} : { isSecret: false },
      order: { sortOrder: 'ASC' },
    });

    return achievements.map((a) => ({
      id: a.id,
      key: a.key,
      name: a.name,
      description: a.description,
      xpReward: a.xpReward,
      icon: a.icon,
      category: a.category,
      isSecret: a.isSecret,
    }));
  }

  /**
   * Get total and unlocked achievement counts for a user
   */
  async getAchievementCounts(userId: string): Promise<{ total: number; unlocked: number }> {
    const total = await this.achievementRepository.count({ where: { isSecret: false } });
    const unlocked = await this.userAchievementRepository.count({ where: { userId } });

    return { total, unlocked };
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Map action strings to achievement keys
   */
  private getAchievementKeyForAction(
    action: string,
    metadata?: Record<string, any>,
  ): string | null {
    switch (action) {
      // Onboarding
      case 'first_reading':
        return 'first_reading';
      case 'profile_complete':
        return 'profile_complete';
      case 'quiz_complete':
        return 'quiz_complete';

      // Features
      case 'compatibility_check':
        const compCount = metadata?.count || 1;
        if (compCount === 1) return 'first_compatibility';
        if (compCount === 5) return 'compatibility_5';
        if (compCount >= 10) return 'compatibility_master';
        return null;

      case 'first_transit':
        return 'first_transit';
      case 'first_horoscope':
        return 'first_horoscope';
      case 'horoscope_week':
        return 'horoscope_week';

      // Social
      case 'share':
        const shareCount = metadata?.count || 1;
        if (shareCount === 1) return 'first_share';
        if (shareCount >= 5) return 'share_5';
        return null;

      case 'add_friend':
        return 'first_friend';
      case 'add_profile':
        const profileCount = metadata?.count || 1;
        if (profileCount === 5) return 'profile_collector_5';
        if (profileCount >= 10) return 'profile_collector_10';
        return null;

      case 'invite_accepted':
        return 'invite_friend';

      // Exploration
      case 'all_signs_read':
        return 'all_signs_read';
      case 'all_houses_read':
        return 'all_houses_read';
      case 'all_planets_read':
        return 'all_planets_read';
      case 'numerology_complete':
        return 'numerology_complete';
      case 'retrograde_check':
        return 'first_retrograde';
      case 'eclipse_read':
        return 'eclipse_reader';

      // Premium
      case 'subscribe_premium':
        return 'premium_member';
      case 'subscribe_ultimate':
        return 'ultimate_member';
      case 'first_premium_feature':
        return 'first_premium_feature';
      case 'yearly_subscription':
        return 'yearly_subscriber';

      // Streaks (handled separately but can be called directly)
      case 'streak_3':
      case 'streak_7':
      case 'streak_14':
      case 'streak_30':
      case 'streak_60':
      case 'streak_100':
      case 'streak_365':
        return action;

      default:
        return null;
    }
  }
}
