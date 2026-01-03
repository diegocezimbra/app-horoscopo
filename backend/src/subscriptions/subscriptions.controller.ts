import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionTier, Subscription } from './entities/subscription.entity';
import { JwtGuard, JwtUser } from '../auth/guards/jwt.guard';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating/upgrading subscription
 */
class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription tier',
    enum: ['free', 'premium', 'ultimate'],
  })
  @IsEnum(['free', 'premium', 'ultimate'])
  tier: SubscriptionTier;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: ['credit_card', 'pix', 'boleto', 'apple_pay', 'google_pay'],
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

/**
 * Subscriptions controller
 * Handles subscription management endpoints
 */
@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Get available subscription plans
   */
  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'List of available plans',
  })
  getPlans() {
    return this.subscriptionsService.getAvailablePlans();
  }

  /**
   * Get current subscription
   */
  @Get('current')
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({
    status: 200,
    description: 'Current subscription details',
  })
  async getCurrentSubscription(@Request() req: { user: JwtUser }): Promise<Subscription | null> {
    return this.subscriptionsService.getCurrentSubscription(req.user.id);
  }

  /**
   * Get subscription history
   */
  @Get('history')
  @ApiOperation({ summary: 'Get subscription history' })
  @ApiResponse({
    status: 200,
    description: 'Subscription history',
  })
  async getHistory(@Request() req: { user: JwtUser }): Promise<Subscription[]> {
    return this.subscriptionsService.getSubscriptionHistory(req.user.id);
  }

  /**
   * Subscribe to a plan
   */
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to a plan' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async subscribe(
    @Request() req: { user: JwtUser },
    @Body() dto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.createSubscription(
      req.user.id,
      dto.tier,
      dto.paymentMethod,
    );
  }

  /**
   * Start a free trial
   */
  @Post('trial')
  @ApiOperation({ summary: 'Start a free trial' })
  @ApiResponse({
    status: 201,
    description: 'Trial started',
  })
  @ApiResponse({ status: 400, description: 'Trial already used' })
  async startTrial(@Request() req: { user: JwtUser }): Promise<Subscription> {
    return this.subscriptionsService.startTrial(req.user.id);
  }

  /**
   * Upgrade subscription tier
   */
  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade subscription tier' })
  @ApiResponse({
    status: 200,
    description: 'Subscription upgraded',
  })
  @ApiResponse({ status: 400, description: 'Cannot downgrade' })
  async upgrade(
    @Request() req: { user: JwtUser },
    @Body() dto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.upgradeTier(req.user.id, dto.tier);
  }

  /**
   * Cancel subscription
   */
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled',
  })
  @ApiResponse({ status: 404, description: 'No active subscription' })
  async cancel(@Request() req: { user: JwtUser }): Promise<Subscription> {
    return this.subscriptionsService.cancelSubscription(req.user.id);
  }
}
