import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

/**
 * Subscriptions module
 * Manages user subscription plans and features
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Subscription, User]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JwtGuard],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
