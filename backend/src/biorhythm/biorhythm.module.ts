import { Module } from '@nestjs/common';
import { BiorhythmController } from './biorhythm.controller';
import { BiorhythmService } from './biorhythm.service';

@Module({
  controllers: [BiorhythmController],
  providers: [BiorhythmService],
  exports: [BiorhythmService],
})
export class BiorhythmModule {}
