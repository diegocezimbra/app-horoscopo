import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UserStreak } from './entities/user-streak.entity';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserXP } from './entities/user-xp.entity';

// Services
import { StreaksService } from './services/streaks.service';
import { AchievementsService } from './services/achievements.service';
import { XPService } from './services/xp.service';
import { LeaderboardService } from './services/leaderboard.service';
import { GamificationService } from './gamification.service';

// Controller
import { GamificationController } from './gamification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStreak,
      Achievement,
      UserAchievement,
      UserXP,
    ]),
  ],
  controllers: [GamificationController],
  providers: [
    StreaksService,
    XPService,
    AchievementsService,
    LeaderboardService,
    GamificationService,
  ],
  exports: [
    GamificationService,
    StreaksService,
    AchievementsService,
    XPService,
    LeaderboardService,
  ],
})
export class GamificationModule {}
