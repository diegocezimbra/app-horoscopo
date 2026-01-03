import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Decorator for authenticated endpoints with common responses
 */
export function ApiAuthEndpoint(summary: string) {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}

/**
 * Decorator for public endpoints
 */
export function ApiPublicEndpoint(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

/**
 * Decorator for premium endpoints
 */
export function ApiPremiumEndpoint(summary: string) {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Premium subscription required' }),
  );
}
