import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserXP } from '../entities/user-xp.entity';
import { UserStreak } from '../entities/user-streak.entity';
import { LeaderboardEntryDto, RankInfoDto } from '../dto/gamification.dto';
import { XPService } from './xp.service';

/**
 * LeaderboardService manages user rankings and competitive features
 * Provides social motivation through competition
 */
@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @InjectRepository(UserXP)
    private readonly xpRepository: Repository<UserXP>,
    @InjectRepository(UserStreak)
    private readonly streakRepository: Repository<UserStreak>,
    private readonly xpService: XPService,
  ) {}

  /**
   * Get the weekly leaderboard (XP earned this week)
   */
  async getWeeklyLeaderboard(
    limit = 10,
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    const leaders = await this.xpRepository.find({
      where: { weeklyXp: MoreThan(0) },
      order: { weeklyXp: 'DESC' },
      take: limit,
    });

    return this.formatLeaderboard(leaders, 'weeklyXp', currentUserId);
  }

  /**
   * Get the monthly leaderboard (XP earned this month)
   */
  async getMonthlyLeaderboard(
    limit = 10,
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    const leaders = await this.xpRepository.find({
      where: { monthlyXp: MoreThan(0) },
      order: { monthlyXp: 'DESC' },
      take: limit,
    });

    return this.formatLeaderboard(leaders, 'monthlyXp', currentUserId);
  }

  /**
   * Get the all-time leaderboard (total XP)
   */
  async getAllTimeLeaderboard(
    limit = 10,
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    const leaders = await this.xpRepository.find({
      where: { totalXp: MoreThan(0) },
      order: { totalXp: 'DESC' },
      take: limit,
    });

    return this.formatLeaderboard(leaders, 'totalXp', currentUserId);
  }

  /**
   * Get user's rank across different leaderboards
   */
  async getUserRank(userId: string): Promise<RankInfoDto> {
    const userXp = await this.xpRepository.findOne({ where: { userId } });

    if (!userXp) {
      return {
        rank: 0,
        totalUsers: 0,
        percentile: 0,
        xpToNextRank: null,
        weeklyRank: 0,
        monthlyRank: 0,
      };
    }

    // Get total user count
    const totalUsers = await this.xpRepository.count();

    // Calculate all-time rank
    const allTimeRank = await this.xpRepository.count({
      where: { totalXp: MoreThan(userXp.totalXp) },
    });

    // Calculate weekly rank
    const weeklyRank = await this.xpRepository.count({
      where: { weeklyXp: MoreThan(userXp.weeklyXp) },
    });

    // Calculate monthly rank
    const monthlyRank = await this.xpRepository.count({
      where: { monthlyXp: MoreThan(userXp.monthlyXp) },
    });

    // Calculate XP needed to reach next rank
    const nextUser = await this.xpRepository.findOne({
      where: { totalXp: MoreThan(userXp.totalXp) },
      order: { totalXp: 'ASC' },
    });

    const xpToNextRank = nextUser ? nextUser.totalXp - userXp.totalXp : null;

    // Calculate percentile (what percentage of users you're better than)
    const percentile = totalUsers > 1 ? Math.floor(((totalUsers - allTimeRank - 1) / (totalUsers - 1)) * 100) : 100;

    return {
      rank: allTimeRank + 1,
      totalUsers,
      percentile: Math.max(0, Math.min(100, percentile)),
      xpToNextRank,
      weeklyRank: weeklyRank + 1,
      monthlyRank: monthlyRank + 1,
    };
  }

  /**
   * Get leaderboard among user's friends
   * Note: This requires a friends system to be implemented
   * For now, returns empty array or could be expanded later
   */
  async getFriendsLeaderboard(
    userId: string,
    friendIds: string[],
    limit = 10,
  ): Promise<LeaderboardEntryDto[]> {
    if (friendIds.length === 0) {
      return [];
    }

    // Include the current user in the friends leaderboard
    const allIds = [...new Set([userId, ...friendIds])];

    const leaders = await this.xpRepository
      .createQueryBuilder('xp')
      .where('xp.userId IN (:...ids)', { ids: allIds })
      .orderBy('xp.totalXp', 'DESC')
      .take(limit)
      .getMany();

    return this.formatLeaderboard(leaders, 'totalXp', userId);
  }

  /**
   * Get streak leaderboard (users with longest current streaks)
   */
  async getStreakLeaderboard(
    limit = 10,
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    const leaders = await this.streakRepository.find({
      where: { currentStreak: MoreThan(0) },
      order: { currentStreak: 'DESC' },
      take: limit,
    });

    // Get XP info for each leader
    const xpPromises = leaders.map((l) => this.xpRepository.findOne({ where: { userId: l.userId } }));
    const xpRecords = await Promise.all(xpPromises);
    const xpMap = new Map(xpRecords.filter(Boolean).map((x) => [x!.userId, x!]));

    return leaders.map((leader, index) => {
      const xpRecord = xpMap.get(leader.userId);
      const level = xpRecord ? xpRecord.level : 1;

      return {
        rank: index + 1,
        userId: leader.userId,
        userName: null, // Would need to join with users table
        xp: xpRecord?.totalXp || 0,
        level,
        levelTitle: this.xpService.getLevelTitle(level),
        currentStreak: leader.currentStreak,
        isCurrentUser: leader.userId === currentUserId,
      };
    });
  }

  /**
   * Get user's position in context (users around them in the leaderboard)
   */
  async getUserContext(
    userId: string,
    range = 2,
  ): Promise<LeaderboardEntryDto[]> {
    const userXp = await this.xpRepository.findOne({ where: { userId } });

    if (!userXp) {
      return [];
    }

    // Get users with more XP (above the current user)
    const above = await this.xpRepository.find({
      where: { totalXp: MoreThan(userXp.totalXp) },
      order: { totalXp: 'ASC' },
      take: range,
    });

    // Get users with less or equal XP (including current user and below)
    const belowAndSelf = await this.xpRepository
      .createQueryBuilder('xp')
      .where('xp.totalXp <= :xp', { xp: userXp.totalXp })
      .orderBy('xp.totalXp', 'DESC')
      .take(range + 1)
      .getMany();

    // Combine and sort
    const combined = [...above.reverse(), ...belowAndSelf];

    // Calculate ranks
    const firstInListRank =
      (await this.xpRepository.count({
        where: { totalXp: MoreThan(combined[0]?.totalXp || 0) },
      })) + 1;

    return combined.map((entry, index) => ({
      rank: firstInListRank + index,
      userId: entry.userId,
      userName: null,
      xp: entry.totalXp,
      level: entry.level,
      levelTitle: this.xpService.getLevelTitle(entry.level),
      currentStreak: null,
      isCurrentUser: entry.userId === userId,
    }));
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Format XP records into leaderboard entries
   */
  private async formatLeaderboard(
    leaders: UserXP[],
    xpField: 'totalXp' | 'weeklyXp' | 'monthlyXp',
    currentUserId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    // Get streak info for each leader
    const streakPromises = leaders.map((l) =>
      this.streakRepository.findOne({ where: { userId: l.userId } }),
    );
    const streaks = await Promise.all(streakPromises);
    const streakMap = new Map(streaks.filter(Boolean).map((s) => [s!.userId, s!.currentStreak]));

    return leaders.map((leader, index) => ({
      rank: index + 1,
      userId: leader.userId,
      userName: null, // Would need to join with users table
      xp: leader[xpField],
      level: leader.level,
      levelTitle: this.xpService.getLevelTitle(leader.level),
      currentStreak: streakMap.get(leader.userId) || null,
      isCurrentUser: leader.userId === currentUserId,
    }));
  }
}
