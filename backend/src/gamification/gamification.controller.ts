import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import {
  RecordVisitDto,
  UseFreezeDto,
  CheckAchievementDto,
  LeaderboardQueryDto,
  GamificationProfileDto,
  StreakInfoDto,
  StreakUpdateDto,
  FreezeResultDto,
  AchievementDto,
  UserAchievementDto,
  AchievementProgressDto,
  XPInfoDto,
  LeaderboardEntryDto,
  RankInfoDto,
} from './dto/gamification.dto';

@ApiTags('Gamification')
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // ==================== PROFILE ====================

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get complete gamification profile for a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Gamification profile', type: GamificationProfileDto })
  async getProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<GamificationProfileDto> {
    return this.gamificationService.getProfile(userId);
  }

  // ==================== DAILY VISIT ====================

  @Post('visit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a daily visit and update streak' })
  @ApiResponse({
    status: 200,
    description: 'Visit recorded successfully',
    schema: {
      type: 'object',
      properties: {
        streak: { $ref: '#/components/schemas/StreakUpdateDto' },
        xp: { $ref: '#/components/schemas/XPUpdateDto' },
        achievements: {
          type: 'array',
          items: { $ref: '#/components/schemas/AchievementDto' },
        },
      },
    },
  })
  async recordVisit(@Body() dto: RecordVisitDto) {
    return this.gamificationService.recordDailyVisit(dto.userId);
  }

  // ==================== STREAKS ====================

  @Get('streak/:userId')
  @ApiOperation({ summary: 'Get user streak information' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Streak info', type: StreakInfoDto })
  async getStreak(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<StreakInfoDto> {
    return this.gamificationService.getStreak(userId);
  }

  @Post('freeze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Use a streak freeze to protect the streak' })
  @ApiResponse({ status: 200, description: 'Freeze result', type: FreezeResultDto })
  async useFreeze(@Body() dto: UseFreezeDto): Promise<FreezeResultDto> {
    return this.gamificationService.useFreeze(dto.userId);
  }

  // ==================== ACHIEVEMENTS ====================

  @Get('achievements')
  @ApiOperation({ summary: 'Get all available achievements' })
  @ApiResponse({ status: 200, description: 'List of achievements', type: [AchievementDto] })
  async getAllAchievements(): Promise<AchievementDto[]> {
    return this.gamificationService.getAllAchievements();
  }

  @Get('achievements/:userId')
  @ApiOperation({ summary: 'Get achievements unlocked by a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User achievements', type: [UserAchievementDto] })
  async getUserAchievements(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserAchievementDto[]> {
    return this.gamificationService.getUserAchievements(userId);
  }

  @Get('achievements/:userId/progress')
  @ApiOperation({ summary: 'Get achievement progress for a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Achievement progress', type: [AchievementProgressDto] })
  async getAchievementProgress(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<AchievementProgressDto[]> {
    return this.gamificationService.getAchievementProgress(userId);
  }

  @Post('achievements/track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track an action that may unlock achievements' })
  @ApiResponse({
    status: 200,
    description: 'Action tracked',
    schema: {
      type: 'object',
      properties: {
        achievement: { $ref: '#/components/schemas/AchievementDto' },
        xp: { $ref: '#/components/schemas/XPUpdateDto' },
      },
    },
  })
  async trackAction(@Body() dto: CheckAchievementDto) {
    return this.gamificationService.trackAction(dto.userId, dto.action, dto.metadata);
  }

  @Post('achievements/:userId/seen')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark achievements as seen' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  async markAchievementsSeen(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { achievementIds?: string[] },
  ): Promise<void> {
    await this.gamificationService.markAchievementsSeen(userId, body.achievementIds);
  }

  // ==================== XP ====================

  @Get('xp/:userId')
  @ApiOperation({ summary: 'Get XP information for a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'XP info', type: XPInfoDto })
  async getXPInfo(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<XPInfoDto> {
    return this.gamificationService.getXPInfo(userId);
  }

  // ==================== LEADERBOARD ====================

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get the leaderboard' })
  @ApiQuery({ name: 'type', enum: ['weekly', 'monthly', 'alltime'], required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'userId', type: 'string', required: false, description: 'Current user ID to mark in leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard entries', type: [LeaderboardEntryDto] })
  async getLeaderboard(
    @Query('type') type?: 'weekly' | 'monthly' | 'alltime',
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    return this.gamificationService.getLeaderboard(type || 'weekly', limit || 10, userId);
  }

  @Get('leaderboard/streaks')
  @ApiOperation({ summary: 'Get the streak leaderboard' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'userId', type: 'string', required: false })
  @ApiResponse({ status: 200, description: 'Streak leaderboard entries', type: [LeaderboardEntryDto] })
  async getStreakLeaderboard(
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
  ): Promise<LeaderboardEntryDto[]> {
    return this.gamificationService.getStreakLeaderboard(limit || 10, userId);
  }

  @Get('rank/:userId')
  @ApiOperation({ summary: 'Get user rank information' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Rank info', type: RankInfoDto })
  async getUserRank(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<RankInfoDto> {
    return this.gamificationService.getUserRank(userId);
  }

  @Get('leaderboard/:userId/context')
  @ApiOperation({ summary: 'Get users around a specific user in the leaderboard' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Leaderboard context', type: [LeaderboardEntryDto] })
  async getUserContext(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<LeaderboardEntryDto[]> {
    return this.gamificationService.getUserLeaderboardContext(userId);
  }
}
