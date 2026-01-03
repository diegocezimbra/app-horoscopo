import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { SubscriptionTier, SubscriptionFeatures } from '../../subscriptions/entities/subscription.entity';

/**
 * Decorator to require specific subscription tier
 */
export const RequireTier = (...tiers: SubscriptionTier[]) =>
  SetMetadata('requiredTiers', tiers);

/**
 * Decorator to require specific subscription feature
 */
export const RequireFeature = (feature: keyof SubscriptionFeatures) =>
  SetMetadata('requiredFeature', feature);

/**
 * Subscription guard
 * Checks if user has required subscription tier or feature
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get required tiers from decorator
    const requiredTiers = this.reflector.get<SubscriptionTier[]>(
      'requiredTiers',
      context.getHandler(),
    );

    // Get required feature from decorator
    const requiredFeature = this.reflector.get<keyof SubscriptionFeatures>(
      'requiredFeature',
      context.getHandler(),
    );

    // Get user's current subscription
    const subscription = await this.subscriptionsService.getCurrentSubscription(user.id);
    const currentTier = subscription?.tier || 'free';

    // Check tier requirement
    if (requiredTiers && requiredTiers.length > 0) {
      if (!requiredTiers.includes(currentTier)) {
        throw new ForbiddenException({
          message: 'Subscription upgrade required',
          code: 'TIER_REQUIRED',
          requiredTiers,
          currentTier,
        });
      }
    }

    // Check feature requirement
    if (requiredFeature) {
      const hasFeature = await this.subscriptionsService.hasFeature(user.id, requiredFeature);
      if (!hasFeature) {
        throw new ForbiddenException({
          message: 'Feature not available in your subscription',
          code: 'FEATURE_REQUIRED',
          requiredFeature,
          currentTier,
        });
      }
    }

    // Attach subscription to request
    request.subscription = subscription;
    return true;
  }
}
