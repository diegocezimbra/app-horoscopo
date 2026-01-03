import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AstrologyModule } from './astrology/astrology.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { BiorhythmModule } from './biorhythm/biorhythm.module';
import { LunarModule } from './lunar/lunar.module';
import { TarotModule } from './tarot/tarot.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GamificationModule } from './gamification/gamification.module';
import { NumerologyModule } from './numerology/numerology.module';
import { DashboardModule } from './dashboard/dashboard.module';

/**
 * Main application module for the Horoscope API
 * Imports all feature modules and configures global providers
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting - protects against brute force attacks
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
    ]),

    // Core modules
    LoggerModule,
    DatabaseModule,

    // Feature modules
    AuthModule,
    UsersModule,
    AstrologyModule,
    OnboardingModule,
    SubscriptionsModule,
    BiorhythmModule,
    LunarModule,
    TarotModule,
    ProfilesModule,
    GamificationModule,
    NumerologyModule,
    DashboardModule,

    // Utility modules
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
