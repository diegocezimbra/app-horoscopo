import { Module } from '@nestjs/common';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

/**
 * TarotModule
 *
 * The tarot reading module providing:
 * - Daily card draws personalized per user
 * - Custom card spreads (1, 3, or 10 cards)
 * - Card details and meanings
 * - Spread type information
 *
 * Features:
 * - 78 complete tarot cards (22 Major + 56 Minor Arcana)
 * - Upright and reversed meanings
 * - Love and career interpretations
 * - Portuguese mystical content
 *
 * Endpoints:
 * - GET /tarot/daily - Daily card (consistent per user per day)
 * - POST /tarot/draw - Custom card draw (1, 3, or 10 cards)
 * - GET /tarot/card/:id - Card details
 * - GET /tarot/spreads - Available spread types
 *
 * @see src/tarot/data/ for card data
 * @see src/tarot/dto/ for DTOs
 */
@Module({
  controllers: [TarotController],
  providers: [TarotService],
  exports: [TarotService],
})
export class TarotModule {}
