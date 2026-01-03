import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AstrologyService } from './astrology.service';
import {
  BirthDataDto,
  ReadingRequestDto,
  CompatibilityRequestDto,
  DailyHoroscopeResponseDto,
  CompatibilityResponseDto,
} from './dto';
import {
  ZodiacSign,
  ZODIAC_SIGNS,
  NatalChart,
  DailyHoroscope,
  CompatibilityResult,
  CelebrityMatch,
} from './types/zodiac.types';
import { JwtGuard, JwtUser } from '../auth/guards/jwt.guard';
import { UsersService } from '../users/users.service';

/**
 * Astrology controller
 * Provides horoscope readings, natal chart calculations, and compatibility analysis
 */
@ApiTags('Astrology')
@Controller('astrology')
export class AstrologyController {
  constructor(
    private readonly astrologyService: AstrologyService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get all zodiac signs with their information
   */
  @Get('signs')
  @ApiOperation({ summary: 'Get all zodiac signs with information' })
  @ApiResponse({
    status: 200,
    description: 'List of all zodiac signs with their characteristics',
  })
  getAllSigns() {
    return this.astrologyService.getAllSigns();
  }

  /**
   * Get information about a specific zodiac sign
   */
  @Get('signs/:sign')
  @ApiOperation({ summary: 'Get zodiac sign information' })
  @ApiParam({
    name: 'sign',
    description: 'Zodiac sign name',
    enum: ZODIAC_SIGNS,
  })
  @ApiResponse({
    status: 200,
    description: 'Zodiac sign information',
  })
  @ApiResponse({ status: 400, description: 'Invalid zodiac sign' })
  getSignInfo(@Param('sign') sign: ZodiacSign) {
    return this.astrologyService.getSignInfo(sign);
  }

  /**
   * Get daily horoscope for a zodiac sign
   */
  @Get('horoscope/daily/:sign')
  @ApiOperation({ summary: 'Get daily horoscope for a zodiac sign' })
  @ApiParam({
    name: 'sign',
    description: 'Zodiac sign name',
    enum: ZODIAC_SIGNS,
  })
  @ApiResponse({
    status: 200,
    description: 'Daily horoscope',
    type: DailyHoroscopeResponseDto,
  })
  getDailyHoroscope(@Param('sign') sign: ZodiacSign): DailyHoroscope {
    return this.astrologyService.getDailyHoroscope(sign);
  }

  /**
   * Calculate natal chart from birth data
   */
  @Post('natal-chart')
  @ApiOperation({ summary: 'Calculate natal chart from birth data' })
  @ApiResponse({
    status: 201,
    description: 'Calculated natal chart',
  })
  @ApiResponse({ status: 400, description: 'Invalid birth data' })
  calculateNatalChart(@Body() birthData: BirthDataDto): NatalChart {
    return this.astrologyService.calculateNatalChart(birthData);
  }

  /**
   * Calculate and save natal chart for authenticated user
   */
  @Post('natal-chart/save')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Calculate and save natal chart for current user' })
  @ApiResponse({
    status: 201,
    description: 'Natal chart calculated and saved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async calculateAndSaveNatalChart(
    @Request() req: { user: JwtUser },
    @Body() birthData: BirthDataDto,
  ): Promise<NatalChart> {
    const natalChart = this.astrologyService.calculateNatalChart(birthData);
    await this.usersService.updateNatalChart(req.user.id, natalChart);
    return natalChart;
  }

  /**
   * Get compatibility between two zodiac signs
   */
  @Post('compatibility')
  @ApiOperation({ summary: 'Calculate compatibility between two signs' })
  @ApiResponse({
    status: 200,
    description: 'Compatibility analysis',
    type: CompatibilityResponseDto,
  })
  getCompatibility(@Body() request: CompatibilityRequestDto): CompatibilityResult {
    return this.astrologyService.getCompatibility(request.sign1, request.sign2);
  }

  /**
   * Get celebrity matches based on user's natal chart
   */
  @Get('celebrity-matches')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get celebrity matches based on natal chart' })
  @ApiResponse({
    status: 200,
    description: 'List of celebrity matches',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCelebrityMatches(@Request() req: { user: JwtUser }): Promise<CelebrityMatch[]> {
    const user = await this.usersService.findById(req.user.id);

    // If user has natal chart, use it; otherwise calculate a basic one
    let natalChart = user.natalChart as NatalChart;
    if (!natalChart) {
      natalChart = this.astrologyService.calculateNatalChart({
        birthDate: user.birthDate.toISOString().split('T')[0],
        birthTime: user.birthTime || undefined,
        birthPlace: user.birthPlace || undefined,
      });
    }

    return this.astrologyService.getCelebrityMatches(natalChart);
  }

  /**
   * Get personalized daily horoscope for authenticated user
   */
  @Get('horoscope/daily')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get personalized daily horoscope' })
  @ApiResponse({
    status: 200,
    description: 'Personalized daily horoscope',
    type: DailyHoroscopeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPersonalizedHoroscope(@Request() req: { user: JwtUser }): Promise<DailyHoroscope> {
    const profile = await this.usersService.getProfile(req.user.id);
    return this.astrologyService.getDailyHoroscope(profile.sunSign as ZodiacSign);
  }
}
