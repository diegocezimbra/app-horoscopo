import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Subscription tiers available
 */
export type SubscriptionTier = 'free' | 'premium' | 'ultimate';

/**
 * Subscription status
 */
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

/**
 * Subscription entity for managing user subscriptions
 */
@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  tier: SubscriptionTier;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: 'credit_card' | 'pix' | 'boleto' | 'apple_pay' | 'google_pay';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ type: 'jsonb', nullable: true })
  features: SubscriptionFeatures;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/**
 * Features available for each subscription tier
 */
export interface SubscriptionFeatures {
  dailyHoroscope: boolean;
  weeklyHoroscope: boolean;
  monthlyHoroscope: boolean;
  yearlyHoroscope: boolean;
  natalChart: boolean;
  detailedNatalChart: boolean;
  compatibility: boolean;
  celebrityMatches: boolean;
  personalizedReadings: boolean;
  adFree: boolean;
  prioritySupport: boolean;
  customThemes: boolean;
}

/**
 * Tier feature configuration
 */
export const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    dailyHoroscope: true,
    weeklyHoroscope: false,
    monthlyHoroscope: false,
    yearlyHoroscope: false,
    natalChart: true,
    detailedNatalChart: false,
    compatibility: true,
    celebrityMatches: false,
    personalizedReadings: false,
    adFree: false,
    prioritySupport: false,
    customThemes: false,
  },
  premium: {
    dailyHoroscope: true,
    weeklyHoroscope: true,
    monthlyHoroscope: true,
    yearlyHoroscope: false,
    natalChart: true,
    detailedNatalChart: true,
    compatibility: true,
    celebrityMatches: true,
    personalizedReadings: true,
    adFree: true,
    prioritySupport: false,
    customThemes: true,
  },
  ultimate: {
    dailyHoroscope: true,
    weeklyHoroscope: true,
    monthlyHoroscope: true,
    yearlyHoroscope: true,
    natalChart: true,
    detailedNatalChart: true,
    compatibility: true,
    celebrityMatches: true,
    personalizedReadings: true,
    adFree: true,
    prioritySupport: true,
    customThemes: true,
  },
};

/**
 * Tier pricing (in BRL)
 */
export const TIER_PRICING: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 19.90,
  ultimate: 39.90,
};
