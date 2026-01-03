import { IsString, IsUUID, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== REQUEST DTOs ====================

export class RecordVisitDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;
}

export class UseFreezeDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;
}

export class CheckAchievementDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Action that triggered the check' })
  @IsString()
  action: string;

  @ApiPropertyOptional({ description: 'Additional metadata for the action' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class AddXPDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Amount of XP to add' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Reason for XP addition' })
  @IsString()
  reason: string;
}

export class LeaderboardQueryDto {
  @ApiPropertyOptional({ description: 'Limit results', default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Type of leaderboard', default: 'weekly' })
  @IsOptional()
  @IsString()
  type?: 'weekly' | 'monthly' | 'alltime';
}

// ==================== RESPONSE DTOs ====================

export class StreakInfoDto {
  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;

  @ApiProperty({ nullable: true })
  lastVisitDate: Date | null;

  @ApiProperty()
  freezesAvailable: number;

  @ApiProperty()
  usedFreezeToday: boolean;

  @ApiProperty()
  totalVisits: number;

  @ApiProperty()
  streakAtRisk: boolean;

  @ApiProperty({ nullable: true })
  nextMilestone: number | null;

  @ApiProperty()
  daysToNextMilestone: number;
}

export class StreakUpdateDto {
  @ApiProperty()
  previousStreak: number;

  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  isNewRecord: boolean;

  @ApiProperty()
  streakMaintained: boolean;

  @ApiProperty()
  streakIncreased: boolean;

  @ApiProperty({ nullable: true })
  milestoneReached: number | null;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty({ type: [String] })
  achievementsUnlocked: string[];
}

export class AchievementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  xpReward: number;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isSecret: boolean;
}

export class UserAchievementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  achievement: AchievementDto;

  @ApiProperty()
  unlockedAt: Date;

  @ApiProperty()
  seen: boolean;
}

export class AchievementProgressDto {
  @ApiProperty()
  achievement: AchievementDto;

  @ApiProperty()
  isUnlocked: boolean;

  @ApiProperty({ nullable: true })
  unlockedAt: Date | null;

  @ApiProperty()
  progress: number; // 0-100

  @ApiProperty({ nullable: true })
  currentValue: number | null;

  @ApiProperty({ nullable: true })
  targetValue: number | null;
}

export class XPInfoDto {
  @ApiProperty()
  totalXp: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  levelTitle: string;

  @ApiProperty()
  xpForCurrentLevel: number;

  @ApiProperty()
  xpForNextLevel: number;

  @ApiProperty()
  xpProgressInLevel: number;

  @ApiProperty()
  percentToNextLevel: number;

  @ApiProperty()
  weeklyXp: number;

  @ApiProperty()
  monthlyXp: number;
}

export class XPUpdateDto {
  @ApiProperty()
  previousXp: number;

  @ApiProperty()
  xpAdded: number;

  @ApiProperty()
  totalXp: number;

  @ApiProperty()
  previousLevel: number;

  @ApiProperty()
  currentLevel: number;

  @ApiProperty()
  leveledUp: boolean;

  @ApiProperty({ nullable: true })
  newLevelTitle: string | null;

  @ApiProperty()
  reason: string;
}

export class LeaderboardEntryDto {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  userId: string;

  @ApiProperty({ nullable: true })
  userName: string | null;

  @ApiProperty()
  xp: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  levelTitle: string;

  @ApiProperty({ nullable: true })
  currentStreak: number | null;

  @ApiProperty()
  isCurrentUser: boolean;
}

export class RankInfoDto {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  percentile: number;

  @ApiProperty({ nullable: true })
  xpToNextRank: number | null;

  @ApiProperty()
  weeklyRank: number;

  @ApiProperty()
  monthlyRank: number;
}

export class GamificationProfileDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  streak: StreakInfoDto;

  @ApiProperty()
  xp: XPInfoDto;

  @ApiProperty()
  rank: RankInfoDto;

  @ApiProperty({ type: [UserAchievementDto] })
  recentAchievements: UserAchievementDto[];

  @ApiProperty()
  totalAchievements: number;

  @ApiProperty()
  unlockedAchievements: number;

  @ApiProperty({ type: [AchievementProgressDto] })
  nextAchievements: AchievementProgressDto[];

  @ApiProperty()
  unseenAchievements: number;
}

export class FreezeResultDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  freezesRemaining: number;

  @ApiProperty()
  streakProtected: boolean;

  @ApiProperty({ nullable: true })
  message: string | null;
}
