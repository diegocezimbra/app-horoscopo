import { Injectable, Logger } from '@nestjs/common';
import {
  ZodiacSign,
  NatalChart,
  DailyHoroscope,
  CompatibilityResult,
  CelebrityMatch,
  ZODIAC_SIGN_DATA,
} from './types/zodiac.types';
import {
  ChartInterpretation,
  WeeklyHoroscope,
  MonthlyHoroscope,
  DetailedCompatibility,
} from './types/astrology.types';
import { BirthDataDto } from './dto/birth-data.dto';
import { NatalChartService } from './services/natal-chart.service';
import { DailyHoroscopeService } from './services/daily-horoscope.service';
import { CompatibilityService } from './services/compatibility.service';

/**
 * AstrologyService - Main facade for astrology functionality
 *
 * This service acts as a unified interface to all astrology-related operations,
 * delegating to specialized services for specific calculations and content generation.
 *
 * Services used:
 * - NatalChartService: Birth chart calculations and interpretations
 * - DailyHoroscopeService: Daily, weekly, and monthly horoscope generation
 * - CompatibilityService: Sign and chart compatibility analysis
 */
@Injectable()
export class AstrologyService {
  private readonly logger = new Logger(AstrologyService.name);

  constructor(
    private readonly natalChartService: NatalChartService,
    private readonly dailyHoroscopeService: DailyHoroscopeService,
    private readonly compatibilityService: CompatibilityService,
  ) {}

  // ==================== NATAL CHART OPERATIONS ====================

  /**
   * Calculate a complete natal chart from birth data
   *
   * @param birthData - Birth date, time, and location information
   * @returns Complete natal chart with planet positions and aspects
   */
  calculateNatalChart(birthData: BirthDataDto): NatalChart {
    this.logger.log(`Calculating natal chart for ${birthData.name || 'user'}`);
    const chart = this.natalChartService.generateNatalChart(birthData);

    // Return in NatalChart format expected by the existing interface
    return {
      sunSign: chart.sunSign,
      moonSign: chart.moonSign,
      ascendant: chart.ascendant,
      planets: chart.planets,
      houses: chart.houses,
      aspects: chart.aspects,
      calculatedAt: chart.calculatedAt,
    };
  }

  /**
   * Generate a full natal chart with interpretation
   *
   * @param birthData - Birth data
   * @returns Chart and detailed interpretation
   */
  generateFullNatalChart(birthData: BirthDataDto): { chart: NatalChart; interpretation: ChartInterpretation } {
    const chart = this.natalChartService.generateNatalChart(birthData);
    const interpretation = this.natalChartService.generateChartInterpretation(chart);

    return {
      chart,
      interpretation,
    };
  }

  /**
   * Get the sun sign from a birth date
   *
   * @param birthDate - Date of birth
   * @returns The zodiac sign
   */
  getSunSign(birthDate: Date): ZodiacSign {
    return this.natalChartService.calculateSunSign(birthDate);
  }

  /**
   * Get approximate moon sign
   *
   * @param birthDate - Date of birth
   * @param birthTime - Time of birth (optional)
   * @returns The approximate moon sign
   */
  getMoonSign(birthDate: Date, birthTime?: string): ZodiacSign {
    return this.natalChartService.calculateMoonSign(birthDate, birthTime);
  }

  /**
   * Get rising sign (ascendant)
   *
   * @param birthDate - Date of birth
   * @param birthTime - Time of birth
   * @param birthPlace - Place of birth (optional)
   * @returns The rising sign
   */
  getRisingSign(birthDate: Date, birthTime?: string, birthPlace?: string): ZodiacSign {
    return this.natalChartService.calculateAscendant(birthDate, birthTime, birthPlace);
  }

  // ==================== HOROSCOPE OPERATIONS ====================

  /**
   * Get daily horoscope for a zodiac sign
   *
   * @param sign - The zodiac sign
   * @param date - Date for the horoscope (defaults to today)
   * @returns Daily horoscope content
   */
  getDailyHoroscope(sign: ZodiacSign, date?: Date): DailyHoroscope {
    this.logger.log(`Getting daily horoscope for ${sign}`);
    return this.dailyHoroscopeService.generateDailyHoroscope(sign, date || new Date());
  }

  /**
   * Get weekly horoscope for a zodiac sign
   *
   * @param sign - The zodiac sign
   * @param weekStart - Start of the week (defaults to current week)
   * @returns Weekly horoscope content
   */
  getWeeklyHoroscope(sign: ZodiacSign, weekStart?: Date): WeeklyHoroscope {
    this.logger.log(`Getting weekly horoscope for ${sign}`);
    return this.dailyHoroscopeService.generateWeeklyHoroscope(sign, weekStart);
  }

  /**
   * Get monthly horoscope for a zodiac sign
   *
   * @param sign - The zodiac sign
   * @param month - Month (1-12)
   * @param year - Year
   * @returns Monthly horoscope content
   */
  getMonthlyHoroscope(sign: ZodiacSign, month?: number, year?: number): MonthlyHoroscope {
    this.logger.log(`Getting monthly horoscope for ${sign}`);
    return this.dailyHoroscopeService.generateMonthlyHoroscope(sign, month, year);
  }

  // ==================== COMPATIBILITY OPERATIONS ====================

  /**
   * Calculate compatibility between two zodiac signs
   *
   * @param sign1 - First zodiac sign
   * @param sign2 - Second zodiac sign
   * @returns Compatibility analysis with scores
   */
  getCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityResult {
    this.logger.log(`Calculating compatibility: ${sign1} + ${sign2}`);
    return this.compatibilityService.calculateCompatibility(sign1, sign2);
  }

  /**
   * Calculate detailed compatibility using full natal charts
   *
   * @param chart1 - First person's natal chart
   * @param chart2 - Second person's natal chart
   * @returns Detailed compatibility with synastry aspects
   */
  getDetailedCompatibility(chart1: NatalChart, chart2: NatalChart): DetailedCompatibility {
    this.logger.log('Calculating detailed chart compatibility');
    return this.compatibilityService.calculateDetailedCompatibility(chart1, chart2);
  }

  /**
   * Find celebrity matches based on user's natal chart
   *
   * @param natalChart - User's natal chart
   * @returns Array of celebrity matches with compatibility info
   */
  getCelebrityMatches(natalChart: NatalChart): CelebrityMatch[] {
    this.logger.log(`Finding celebrity matches for ${natalChart.sunSign}`);
    const matches = this.compatibilityService.findCelebrityMatches(natalChart);

    // Transform to CelebrityMatch format expected by existing interface
    return matches.map((match) => ({
      name: match.name,
      birthDate: new Date(), // Placeholder
      sunSign: match.sunSign,
      matchScore: match.matchPercentage,
      sharedPlacements: match.commonalities,
      category: 'entertainment' as const,
    }));
  }

  // ==================== SIGN DATA OPERATIONS ====================

  /**
   * Get all zodiac signs with their information
   *
   * @returns Object containing all zodiac sign data
   */
  getAllSigns(): typeof ZODIAC_SIGN_DATA {
    return ZODIAC_SIGN_DATA;
  }

  /**
   * Get detailed information about a specific zodiac sign
   *
   * @param sign - The zodiac sign
   * @returns Comprehensive sign data
   */
  getSignInfo(sign: ZodiacSign) {
    return this.natalChartService.getZodiacSignData(sign);
  }

  /**
   * Get information about a planet
   *
   * @param planet - The planet name
   * @returns Planet data and meaning
   */
  getPlanetInfo(planet: string) {
    return this.natalChartService.getPlanetData(planet as any);
  }

  /**
   * Get information about an astrological house
   *
   * @param house - The house number (1-12)
   * @returns House data and meaning
   */
  getHouseInfo(house: number) {
    return this.natalChartService.getHouseData(house);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get the "Big Three" (Sun, Moon, Rising) for a birth date/time
   *
   * @param birthDate - Date of birth
   * @param birthTime - Time of birth (optional)
   * @param birthPlace - Place of birth (optional)
   * @returns Object with sun, moon, and rising signs
   */
  getBigThree(
    birthDate: Date,
    birthTime?: string,
    birthPlace?: string,
  ): { sun: ZodiacSign; moon: ZodiacSign; rising: ZodiacSign } {
    return {
      sun: this.natalChartService.calculateSunSign(birthDate),
      moon: this.natalChartService.calculateMoonSign(birthDate, birthTime),
      rising: this.natalChartService.calculateAscendant(birthDate, birthTime, birthPlace),
    };
  }

  /**
   * Check if two signs are compatible
   *
   * @param sign1 - First sign
   * @param sign2 - Second sign
   * @returns Boolean indicating if signs are naturally compatible
   */
  areSignsCompatible(sign1: ZodiacSign, sign2: ZodiacSign): boolean {
    const compatibility = this.getCompatibility(sign1, sign2);
    return compatibility.overallScore >= 70;
  }

  /**
   * Get compatible signs for a given sign
   *
   * @param sign - The zodiac sign
   * @returns Array of compatible signs
   */
  getCompatibleSigns(sign: ZodiacSign): ZodiacSign[] {
    const signData = ZODIAC_SIGN_DATA[sign];
    return signData.compatibility;
  }
}
