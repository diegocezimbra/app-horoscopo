import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LunarService, CurrentLunarPhase, LunarCalendarMonth, NextFullMoon } from './lunar.service';
import { LunarPhaseData } from './data/lunar-phases.data';

/**
 * LunarController
 *
 * REST API endpoints for lunar phase information:
 * - Current lunar phase with illumination and rituals
 * - Monthly lunar calendar generation
 * - Next full moon prediction
 * - Individual phase details
 */
@ApiTags('Lunar')
@Controller('lunar')
export class LunarController {
  constructor(private readonly lunarService: LunarService) {}

  /**
   * Get the current lunar phase
   * Returns detailed information about today's lunar phase including
   * illumination percentage, energy, rituals, and crystals
   */
  @Get('current')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current lunar phase',
    description: 'Returns the current lunar phase with illumination percentage, energy description, recommended rituals, crystals, and colors.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current lunar phase information',
  })
  getCurrentPhase(): CurrentLunarPhase {
    return this.lunarService.getCurrentPhase();
  }

  /**
   * Get lunar calendar for a specific month
   * Returns day-by-day lunar information including phases and illumination
   */
  @Get('calendar/:month/:year')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get lunar calendar for a month',
    description: 'Returns a complete lunar calendar for the specified month and year, including all phases, new moons, and full moons.',
  })
  @ApiParam({
    name: 'month',
    description: 'Month number (1-12)',
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'year',
    description: 'Year (e.g., 2024)',
    type: Number,
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Lunar calendar for the specified month',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid month or year',
  })
  getMonthlyCalendar(
    @Param('month', ParseIntPipe) month: number,
    @Param('year', ParseIntPipe) year: number,
  ): LunarCalendarMonth {
    // Validate month range
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    // Validate year range (reasonable bounds)
    if (year < 1900 || year > 2100) {
      throw new Error('Year must be between 1900 and 2100');
    }

    return this.lunarService.getMonthlyCalendar(month, year);
  }

  /**
   * Get the next full moon date
   * Returns when the next full moon will occur and how many days until then
   */
  @Get('next-full-moon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get next full moon date',
    description: 'Returns the date of the next full moon and how many days until it occurs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Next full moon information',
  })
  getNextFullMoon(): NextFullMoon {
    return this.lunarService.getNextFullMoon();
  }

  /**
   * Get the next new moon date
   * Returns when the next new moon will occur
   */
  @Get('next-new-moon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get next new moon date',
    description: 'Returns the date of the next new moon and how many days until it occurs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Next new moon information',
  })
  getNextNewMoon(): { date: Date; daysUntil: number } {
    return this.lunarService.getNextNewMoon();
  }

  /**
   * Get details of a specific lunar phase by ID
   * Valid IDs: new-moon, waxing-crescent, first-quarter, waxing-gibbous,
   *            full-moon, waning-gibbous, last-quarter, waning-crescent
   */
  @Get('phase/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get lunar phase details by ID',
    description: 'Returns detailed information about a specific lunar phase including rituals, crystals, colors, and energy.',
  })
  @ApiParam({
    name: 'id',
    description: 'Lunar phase ID',
    type: String,
    enum: [
      'new-moon',
      'waxing-crescent',
      'first-quarter',
      'waxing-gibbous',
      'full-moon',
      'waning-gibbous',
      'last-quarter',
      'waning-crescent',
    ],
    example: 'full-moon',
  })
  @ApiResponse({
    status: 200,
    description: 'Lunar phase details',
  })
  @ApiResponse({
    status: 404,
    description: 'Lunar phase not found',
  })
  getPhaseById(@Param('id') id: string): LunarPhaseData {
    return this.lunarService.getPhaseById(id);
  }

  /**
   * Get all lunar phases
   * Returns an array of all 8 lunar phases with their complete data
   */
  @Get('phases')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all lunar phases',
    description: 'Returns all 8 lunar phases with their complete information in order.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all lunar phases',
  })
  getAllPhases(): LunarPhaseData[] {
    return this.lunarService.getAllPhases();
  }

  /**
   * Get today's lunar energy advice
   * Returns personalized advice and suggested rituals for today
   */
  @Get('today-advice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get today\'s lunar advice',
    description: 'Returns personalized advice and suggested rituals based on the current lunar phase.',
  })
  @ApiResponse({
    status: 200,
    description: 'Today\'s lunar advice and rituals',
  })
  getTodayAdvice(): { phase: LunarPhaseData; advice: string; rituals: string[] } {
    return this.lunarService.getTodayAdvice();
  }
}
