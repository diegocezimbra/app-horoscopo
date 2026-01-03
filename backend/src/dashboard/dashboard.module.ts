import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AstrologyModule } from '../astrology/astrology.module';
import { LunarModule } from '../lunar/lunar.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AstrologyModule,
    LunarModule,
    GamificationModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
