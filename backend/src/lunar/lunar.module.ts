import { Module } from '@nestjs/common';
import { LunarController } from './lunar.controller';
import { LunarService } from './lunar.service';

/**
 * LunarModule
 *
 * Module for lunar phase calculations and information.
 * Provides accurate lunar phase data based on the synodic month cycle.
 *
 * Features:
 * - Real-time lunar phase calculation
 * - Monthly lunar calendar generation
 * - Next full/new moon predictions
 * - Phase-specific rituals, crystals, and guidance
 *
 * Endpoints:
 * - GET /lunar/current - Current lunar phase with illumination
 * - GET /lunar/calendar/:month/:year - Monthly lunar calendar
 * - GET /lunar/next-full-moon - Next full moon date
 * - GET /lunar/next-new-moon - Next new moon date
 * - GET /lunar/phase/:id - Details of a specific phase
 * - GET /lunar/phases - All 8 lunar phases
 * - GET /lunar/today-advice - Today's lunar energy advice
 *
 * The lunar calculations are based on:
 * - Synodic month duration: 29.53058867 days
 * - Reference new moon: January 11, 2024 at 11:57 UTC
 *
 * @see src/lunar/data/lunar-phases.data.ts for phase data
 * @see src/lunar/lunar.service.ts for calculation logic
 */
@Module({
  controllers: [LunarController],
  providers: [LunarService],
  exports: [LunarService],
})
export class LunarModule {}
