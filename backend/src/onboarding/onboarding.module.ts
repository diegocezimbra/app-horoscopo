import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { User } from '../users/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AstrologyModule } from '../astrology/astrology.module';

/**
 * Onboarding module
 * Handles multi-step user registration flow
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => AstrologyModule),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
