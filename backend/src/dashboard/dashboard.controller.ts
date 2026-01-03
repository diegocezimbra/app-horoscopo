import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  DashboardDataDto,
  LuckyNumbersDto,
  CosmicEventDto,
} from './dto/dashboard.dto';
import { JwtGuard, JwtUser } from '../auth/guards/jwt.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get complete dashboard data for the authenticated user
   */
  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get complete dashboard data for current user' })
  @ApiResponse({ status: 200, description: 'Dashboard data', type: DashboardDataDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboardData(@Request() req: { user: JwtUser }): Promise<DashboardDataDto> {
    return this.dashboardService.getDashboardData(req.user.id);
  }

  /**
   * Generate new lucky numbers
   */
  @Post('lucky-numbers')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generate new lucky numbers' })
  @ApiResponse({ status: 200, description: 'Lucky numbers', type: LuckyNumbersDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateLuckyNumbers(@Request() req: { user: JwtUser }): Promise<LuckyNumbersDto> {
    return this.dashboardService.generateLuckyNumbers(req.user.id);
  }

  /**
   * Get upcoming cosmic events
   */
  @Get('cosmic-events')
  @ApiOperation({ summary: 'Get upcoming cosmic events' })
  @ApiResponse({ status: 200, description: 'Cosmic events', type: [CosmicEventDto] })
  async getCosmicEvents(): Promise<CosmicEventDto[]> {
    return this.dashboardService.getCosmicEvents();
  }
}
