import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AstrologyController } from './astrology.controller';
import { AstrologyService } from './astrology.service';
import { NatalChartService } from './services/natal-chart.service';
import { DailyHoroscopeService } from './services/daily-horoscope.service';
import { CompatibilityService } from './services/compatibility.service';
import { UsersModule } from '../users/users.module';

/**
 * AstrologyModule
 *
 * The core astrology engine module providing:
 * - Natal chart calculations and interpretations
 * - Daily, weekly, and monthly horoscope generation
 * - Sign and chart compatibility analysis
 * - Celebrity matching based on natal charts
 *
 * Services:
 * - AstrologyService: Main facade for all astrology operations
 * - NatalChartService: Birth chart calculations with planet positions and aspects
 * - DailyHoroscopeService: Mystical horoscope content generation
 * - CompatibilityService: Comprehensive compatibility analysis
 *
 * Data:
 * - Zodiac data: All 12 signs with traits, compatibility, and characteristics
 * - Planets data: All celestial bodies with meanings and dignities
 * - Houses data: All 12 astrological houses with life area meanings
 *
 * @see src/astrology/data/ for static astrological data
 * @see src/astrology/services/ for specialized calculation services
 * @see src/astrology/types/ for TypeScript type definitions
 * @see src/astrology/dto/ for request/response DTOs
 */
@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AstrologyController],
  providers: [
    // Main facade service
    AstrologyService,

    // Specialized calculation services
    NatalChartService,
    DailyHoroscopeService,
    CompatibilityService,
  ],
  exports: [
    // Export main service for use by other modules
    AstrologyService,

    // Export specialized services for direct access if needed
    NatalChartService,
    DailyHoroscopeService,
    CompatibilityService,
  ],
})
export class AstrologyModule {}
