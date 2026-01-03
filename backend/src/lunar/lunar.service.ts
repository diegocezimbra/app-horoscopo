import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  LunarPhaseData,
  LUNAR_PHASES,
  LUNAR_PHASES_ORDER,
  SYNODIC_MONTH_DAYS,
  REFERENCE_NEW_MOON,
  getLunarPhaseFromAge,
  calculateIllumination,
  getLunarPhaseById,
  getAllLunarPhases,
} from './data/lunar-phases.data';

/**
 * Interface for current lunar phase response
 */
export interface CurrentLunarPhase {
  phase: LunarPhaseData;
  illumination: number;
  lunarAge: number;
  isWaxing: boolean;
  nextPhase: LunarPhaseData;
  daysUntilNextPhase: number;
  date: Date;
}

/**
 * Interface for lunar calendar day
 */
export interface LunarCalendarDay {
  date: string;
  dayOfMonth: number;
  phase: LunarPhaseData;
  illumination: number;
  isWaxing: boolean;
  isNewMoon: boolean;
  isFullMoon: boolean;
}

/**
 * Interface for lunar calendar month
 */
export interface LunarCalendarMonth {
  month: number;
  year: number;
  monthName: string;
  days: LunarCalendarDay[];
  newMoons: LunarCalendarDay[];
  fullMoons: LunarCalendarDay[];
}

/**
 * Interface for next full moon response
 */
export interface NextFullMoon {
  date: Date;
  dateFormatted: string;
  daysUntil: number;
  phase: LunarPhaseData;
}

/**
 * LunarService - Main service for lunar phase calculations
 *
 * This service provides accurate lunar phase calculations based on
 * the synodic month (29.53 days) and a known reference new moon date.
 *
 * Features:
 * - Current lunar phase with illumination percentage
 * - Monthly lunar calendar generation
 * - Next full moon prediction
 * - Phase details and rituals
 */
@Injectable()
export class LunarService {
  private readonly logger = new Logger(LunarService.name);

  // Month names in Portuguese
  private readonly monthNames = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  /**
   * Calculate the lunar age (days since last new moon) for a given date
   * @param date - The date to calculate for
   * @returns The lunar age in days (0 to 29.53)
   */
  calculateLunarAge(date: Date): number {
    const targetTime = date.getTime();
    const referenceTime = REFERENCE_NEW_MOON.getTime();
    const millisecondsDiff = targetTime - referenceTime;
    const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);

    // Normalize to 0-29.53 range
    const lunarAge = ((daysDiff % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
    return lunarAge;
  }

  /**
   * Get the current lunar phase with full details
   * @param date - Optional date (defaults to now)
   * @returns Current lunar phase information
   */
  getCurrentPhase(date?: Date): CurrentLunarPhase {
    const targetDate = date || new Date();
    const lunarAge = this.calculateLunarAge(targetDate);
    const phaseId = getLunarPhaseFromAge(lunarAge);
    const phase = LUNAR_PHASES[phaseId];
    const illumination = calculateIllumination(lunarAge);

    // Determine if waxing (first half of cycle) or waning
    const isWaxing = lunarAge < SYNODIC_MONTH_DAYS / 2;

    // Calculate next phase
    const currentPhaseIndex = LUNAR_PHASES_ORDER.indexOf(phaseId);
    const nextPhaseIndex = (currentPhaseIndex + 1) % LUNAR_PHASES_ORDER.length;
    const nextPhaseId = LUNAR_PHASES_ORDER[nextPhaseIndex];
    const nextPhase = LUNAR_PHASES[nextPhaseId];

    // Calculate days until next phase
    const daysUntilNextPhase = this.calculateDaysUntilNextPhase(lunarAge, currentPhaseIndex);

    this.logger.log(`Current lunar phase: ${phase.namePt} (${illumination}% illumination)`);

    return {
      phase,
      illumination,
      lunarAge: Math.round(lunarAge * 100) / 100,
      isWaxing,
      nextPhase,
      daysUntilNextPhase: Math.round(daysUntilNextPhase * 10) / 10,
      date: targetDate,
    };
  }

  /**
   * Calculate days until the next lunar phase
   * @param currentLunarAge - Current lunar age in days
   * @param currentPhaseIndex - Index of current phase
   * @returns Days until next phase
   */
  private calculateDaysUntilNextPhase(currentLunarAge: number, currentPhaseIndex: number): number {
    const phaseDuration = SYNODIC_MONTH_DAYS / 8;

    // Calculate the end of current phase
    const phaseEndAge = this.getPhaseEndAge(currentPhaseIndex);
    let daysUntil = phaseEndAge - currentLunarAge;

    if (daysUntil <= 0) {
      daysUntil += SYNODIC_MONTH_DAYS;
    }

    return daysUntil;
  }

  /**
   * Get the lunar age at which a phase ends
   * @param phaseIndex - Index of the phase
   * @returns Lunar age in days when this phase ends
   */
  private getPhaseEndAge(phaseIndex: number): number {
    const phaseDuration = SYNODIC_MONTH_DAYS / 8;
    // Phase boundaries (approximate)
    const boundaries = [
      phaseDuration * 0.5,   // New Moon ends
      phaseDuration * 3.5,   // Waxing Crescent ends
      phaseDuration * 4.5,   // First Quarter ends
      phaseDuration * 7.5,   // Waxing Gibbous ends
      phaseDuration * 8.5,   // Full Moon ends (wraps to next cycle calculation)
      phaseDuration * 11.5,  // Waning Gibbous ends
      phaseDuration * 12.5,  // Last Quarter ends
      SYNODIC_MONTH_DAYS,    // Waning Crescent ends (new moon starts)
    ];

    return boundaries[phaseIndex] || SYNODIC_MONTH_DAYS;
  }

  /**
   * Generate a lunar calendar for a specific month
   * @param month - Month number (1-12)
   * @param year - Year
   * @returns Lunar calendar for the month
   */
  getMonthlyCalendar(month: number, year: number): LunarCalendarMonth {
    this.logger.log(`Generating lunar calendar for ${month}/${year}`);

    const daysInMonth = new Date(year, month, 0).getDate();
    const days: LunarCalendarDay[] = [];
    const newMoons: LunarCalendarDay[] = [];
    const fullMoons: LunarCalendarDay[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day, 12, 0, 0); // Noon UTC
      const lunarAge = this.calculateLunarAge(date);
      const phaseId = getLunarPhaseFromAge(lunarAge);
      const phase = LUNAR_PHASES[phaseId];
      const illumination = calculateIllumination(lunarAge);
      const isWaxing = lunarAge < SYNODIC_MONTH_DAYS / 2;

      const isNewMoon = phaseId === 'new-moon';
      const isFullMoon = phaseId === 'full-moon';

      const calendarDay: LunarCalendarDay = {
        date: date.toISOString().split('T')[0],
        dayOfMonth: day,
        phase,
        illumination,
        isWaxing,
        isNewMoon,
        isFullMoon,
      };

      days.push(calendarDay);

      if (isNewMoon) {
        newMoons.push(calendarDay);
      }
      if (isFullMoon) {
        fullMoons.push(calendarDay);
      }
    }

    return {
      month,
      year,
      monthName: this.monthNames[month - 1],
      days,
      newMoons,
      fullMoons,
    };
  }

  /**
   * Get the next full moon date
   * @param fromDate - Starting date (defaults to now)
   * @returns Next full moon information
   */
  getNextFullMoon(fromDate?: Date): NextFullMoon {
    const startDate = fromDate || new Date();
    const lunarAge = this.calculateLunarAge(startDate);

    // Full moon occurs around day 14.76 of the lunar cycle
    const fullMoonAge = SYNODIC_MONTH_DAYS / 2;

    let daysUntilFullMoon: number;

    if (lunarAge < fullMoonAge) {
      // Full moon is still coming in this cycle
      daysUntilFullMoon = fullMoonAge - lunarAge;
    } else {
      // Full moon already passed, calculate for next cycle
      daysUntilFullMoon = (SYNODIC_MONTH_DAYS - lunarAge) + fullMoonAge;
    }

    const fullMoonDate = new Date(startDate.getTime() + daysUntilFullMoon * 24 * 60 * 60 * 1000);
    const phase = LUNAR_PHASES['full-moon'];

    this.logger.log(`Next full moon: ${fullMoonDate.toISOString()} (in ${daysUntilFullMoon.toFixed(1)} days)`);

    return {
      date: fullMoonDate,
      dateFormatted: this.formatDatePt(fullMoonDate),
      daysUntil: Math.round(daysUntilFullMoon * 10) / 10,
      phase,
    };
  }

  /**
   * Get the next new moon date
   * @param fromDate - Starting date (defaults to now)
   * @returns Next new moon date and days until
   */
  getNextNewMoon(fromDate?: Date): { date: Date; daysUntil: number } {
    const startDate = fromDate || new Date();
    const lunarAge = this.calculateLunarAge(startDate);

    // New moon occurs at day 0 of the cycle
    const daysUntilNewMoon = SYNODIC_MONTH_DAYS - lunarAge;
    const newMoonDate = new Date(startDate.getTime() + daysUntilNewMoon * 24 * 60 * 60 * 1000);

    return {
      date: newMoonDate,
      daysUntil: Math.round(daysUntilNewMoon * 10) / 10,
    };
  }

  /**
   * Get lunar phase by ID
   * @param phaseId - The phase identifier
   * @returns Lunar phase data
   * @throws NotFoundException if phase not found
   */
  getPhaseById(phaseId: string): LunarPhaseData {
    const phase = getLunarPhaseById(phaseId);

    if (!phase) {
      throw new NotFoundException(`Lunar phase '${phaseId}' not found`);
    }

    this.logger.log(`Retrieved phase: ${phase.namePt}`);
    return phase;
  }

  /**
   * Get all lunar phases
   * @returns Array of all lunar phase data
   */
  getAllPhases(): LunarPhaseData[] {
    return getAllLunarPhases();
  }

  /**
   * Get the lunar phase for a specific date
   * @param date - The date to check
   * @returns Lunar phase data for that date
   */
  getPhaseForDate(date: Date): LunarPhaseData {
    const lunarAge = this.calculateLunarAge(date);
    const phaseId = getLunarPhaseFromAge(lunarAge);
    return LUNAR_PHASES[phaseId];
  }

  /**
   * Format date in Portuguese
   * @param date - Date to format
   * @returns Formatted date string
   */
  private formatDatePt(date: Date): string {
    const day = date.getDate();
    const month = this.monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  }

  /**
   * Get lunar energy advice for today
   * @returns Energy advice based on current lunar phase
   */
  getTodayAdvice(): { phase: LunarPhaseData; advice: string; rituals: string[] } {
    const current = this.getCurrentPhase();
    return {
      phase: current.phase,
      advice: current.phase.advice,
      rituals: current.phase.rituals,
    };
  }
}
