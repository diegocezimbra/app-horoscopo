import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Root application controller
 * Provides basic API information endpoints
 */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Get API information and status
   */
  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({
    status: 200,
    description: 'API information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Horoscope API' },
        version: { type: 'string', example: '1.0.0' },
        description: { type: 'string' },
        docs: { type: 'string', example: '/api/docs' },
      },
    },
  })
  getApiInfo() {
    return this.appService.getApiInfo();
  }
}
