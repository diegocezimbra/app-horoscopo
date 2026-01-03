import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  SubscriptionFeatures,
  TIER_FEATURES,
  TIER_PRICING,
} from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';

/**
 * Subscriptions service for managing user subscriptions
 */
@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get user's current subscription
   */
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { userId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all available subscription plans
   */
  getAvailablePlans() {
    return Object.entries(TIER_FEATURES).map(([tier, features]) => ({
      tier: tier as SubscriptionTier,
      price: TIER_PRICING[tier as SubscriptionTier],
      currency: 'BRL',
      features,
    }));
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    userId: string,
    tier: SubscriptionTier,
    paymentMethod?: string,
  ): Promise<Subscription> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cancel existing active subscription
    const existingSubscription = await this.getCurrentSubscription(userId);
    if (existingSubscription) {
      existingSubscription.status = 'cancelled';
      existingSubscription.endDate = new Date();
      await this.subscriptionRepository.save(existingSubscription);
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Create new subscription
    const subscription = this.subscriptionRepository.create({
      userId,
      tier,
      status: 'active',
      startDate,
      endDate: tier === 'free' ? undefined : endDate,
      monthlyPrice: TIER_PRICING[tier],
      currency: 'BRL',
      autoRenew: tier !== 'free',
      features: TIER_FEATURES[tier],
      paymentMethod: paymentMethod as 'credit_card' | 'pix' | 'boleto' | 'apple_pay' | 'google_pay' | undefined,
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Update user's subscription tier
    user.subscriptionTier = tier;
    await this.userRepository.save(user);

    this.logger.log(`Subscription created: ${userId} -> ${tier}`);
    return savedSubscription;
  }

  /**
   * Start a trial subscription
   */
  async startTrial(userId: string, tier: SubscriptionTier = 'premium'): Promise<Subscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already had a trial
    const previousTrial = await this.subscriptionRepository.findOne({
      where: { userId, status: 'trial' },
    });
    if (previousTrial) {
      throw new BadRequestException('Trial already used');
    }

    const startDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial

    const subscription = this.subscriptionRepository.create({
      userId,
      tier,
      status: 'trial',
      startDate,
      trialEndDate,
      monthlyPrice: 0,
      currency: 'BRL',
      autoRenew: false,
      features: TIER_FEATURES[tier],
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Update user's subscription tier
    user.subscriptionTier = tier;
    await this.userRepository.save(user);

    this.logger.log(`Trial started: ${userId} -> ${tier}`);
    return savedSubscription;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getCurrentSubscription(userId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.endDate = new Date();

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Revert user to free tier
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.subscriptionTier = 'free';
      await this.userRepository.save(user);
    }

    this.logger.log(`Subscription cancelled: ${userId}`);
    return savedSubscription;
  }

  /**
   * Upgrade subscription tier
   */
  async upgradeTier(userId: string, newTier: SubscriptionTier): Promise<Subscription> {
    const currentSubscription = await this.getCurrentSubscription(userId);

    if (!currentSubscription) {
      return this.createSubscription(userId, newTier);
    }

    const tierOrder: SubscriptionTier[] = ['free', 'premium', 'ultimate'];
    const currentIndex = tierOrder.indexOf(currentSubscription.tier);
    const newIndex = tierOrder.indexOf(newTier);

    if (newIndex <= currentIndex) {
      throw new BadRequestException('Can only upgrade to a higher tier');
    }

    return this.createSubscription(userId, newTier);
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeature(userId: string, feature: keyof SubscriptionFeatures): Promise<boolean> {
    const subscription = await this.getCurrentSubscription(userId);
    const tier = subscription?.tier || 'free';
    return TIER_FEATURES[tier][feature];
  }

  /**
   * Get subscription history for a user
   */
  async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Process expired subscriptions (for cron job)
   */
  async processExpiredSubscriptions(): Promise<void> {
    const now = new Date();

    // Find expired trials
    const expiredTrials = await this.subscriptionRepository.find({
      where: { status: 'trial' },
    });

    for (const subscription of expiredTrials) {
      if (subscription.trialEndDate && subscription.trialEndDate < now) {
        subscription.status = 'expired';
        await this.subscriptionRepository.save(subscription);

        // Revert user to free tier
        const user = await this.userRepository.findOne({
          where: { id: subscription.userId },
        });
        if (user) {
          user.subscriptionTier = 'free';
          await this.userRepository.save(user);
        }

        this.logger.log(`Trial expired: ${subscription.userId}`);
      }
    }

    // Find expired paid subscriptions
    const expiredPaid = await this.subscriptionRepository.find({
      where: { status: 'active' },
    });

    for (const subscription of expiredPaid) {
      if (subscription.endDate && subscription.endDate < now && !subscription.autoRenew) {
        subscription.status = 'expired';
        await this.subscriptionRepository.save(subscription);

        const user = await this.userRepository.findOne({
          where: { id: subscription.userId },
        });
        if (user) {
          user.subscriptionTier = 'free';
          await this.userRepository.save(user);
        }

        this.logger.log(`Subscription expired: ${subscription.userId}`);
      }
    }
  }
}
