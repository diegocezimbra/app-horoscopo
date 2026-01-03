import { Injectable } from '@nestjs/common';

/**
 * Root application service
 * Provides basic API information
 */
@Injectable()
export class AppService {
  /**
   * Get API information
   */
  getApiInfo() {
    return {
      name: 'Horoscope API',
      version: '1.0.0',
      description: 'Astrology and horoscope API for mobile-first web application',
      docs: '/api/docs',
      endpoints: {
        auth: '/auth',
        users: '/users',
        astrology: '/astrology',
        onboarding: '/onboarding',
        subscriptions: '/subscriptions',
        health: '/health',
      },
    };
  }
}
