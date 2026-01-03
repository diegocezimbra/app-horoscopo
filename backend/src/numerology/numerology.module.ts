import { Module } from '@nestjs/common';
import { NumerologyController } from './numerology.controller';
import { NumerologyService } from './numerology.service';
import { LifePathService } from './services/life-path.service';
import { DestinyService } from './services/destiny.service';
import { SoulService } from './services/soul.service';
import { PersonalityService } from './services/personality.service';
import { BirthdayService } from './services/birthday.service';

@Module({
  controllers: [NumerologyController],
  providers: [
    NumerologyService,
    LifePathService,
    DestinyService,
    SoulService,
    PersonalityService,
    BirthdayService,
  ],
  exports: [
    NumerologyService,
    LifePathService,
    DestinyService,
    SoulService,
    PersonalityService,
    BirthdayService,
  ],
})
export class NumerologyModule {}
