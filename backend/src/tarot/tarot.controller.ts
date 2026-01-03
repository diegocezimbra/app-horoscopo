import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TarotService } from './tarot.service';
import {
  DrawCardDto,
  TarotReadingResponseDto,
  DailyCardResponseDto,
  SpreadType,
} from './dto/draw-card.dto';
import { TarotCard } from './data/major-arcana.data';
import { Suit, SUIT_INFO } from './data/minor-arcana.data';
import { JwtGuard, JwtUser } from '../auth/guards/jwt.guard';

/**
 * TarotController
 *
 * REST API endpoints for tarot card readings and information.
 * Provides daily card draws, custom spreads, and card details.
 */
@ApiTags('Tarot')
@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  // ==================== DAILY CARD ====================

  /**
   * Get daily tarot card for anonymous user
   */
  @Get('daily')
  @ApiOperation({
    summary: 'Get daily tarot card',
    description: 'Returns a consistent daily tarot card. For authenticated users, the card is personalized based on user ID.',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Optional user ID for consistent daily card',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily tarot card with guidance',
    type: DailyCardResponseDto,
  })
  getDailyCard(@Query('userId') userId?: string): DailyCardResponseDto {
    return this.tarotService.getDailyCard(userId);
  }

  /**
   * Get personalized daily card for authenticated user
   */
  @Get('daily/me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get personalized daily tarot card',
    description: 'Returns a daily tarot card personalized for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Personalized daily tarot card',
    type: DailyCardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPersonalizedDailyCard(@Request() req: { user: JwtUser }): DailyCardResponseDto {
    return this.tarotService.getDailyCard(req.user.id);
  }

  // ==================== CARD DRAWS ====================

  /**
   * Draw cards for a custom reading
   */
  @Post('draw')
  @ApiOperation({
    summary: 'Draw tarot cards',
    description: 'Draw 1, 3, or 10 cards for a tarot reading with optional spread type.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tarot reading result',
    type: TarotReadingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  drawCards(@Body() dto: DrawCardDto): TarotReadingResponseDto {
    return this.tarotService.drawCards(dto);
  }

  /**
   * Draw cards for authenticated user (with tracking)
   */
  @Post('draw/me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Draw tarot cards (authenticated)',
    description: 'Draw cards for authenticated user. Reading can be saved to history.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tarot reading result',
    type: TarotReadingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  drawCardsAuthenticated(
    @Request() req: { user: JwtUser },
    @Body() dto: DrawCardDto,
  ): TarotReadingResponseDto {
    // Add userId to DTO for tracking
    dto.userId = req.user.id;
    return this.tarotService.drawCards(dto);
  }

  // ==================== CARD INFORMATION ====================

  /**
   * Get details of a specific card
   */
  @Get('card/:id')
  @ApiOperation({
    summary: 'Get card details',
    description: 'Get detailed information about a specific tarot card by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Card ID (e.g., major-0, cups-1, swords-14)',
    example: 'major-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Card details',
  })
  @ApiResponse({ status: 404, description: 'Card not found' })
  getCardById(@Param('id') cardId: string): TarotCard {
    return this.tarotService.getCardById(cardId);
  }

  /**
   * Get all cards
   */
  @Get('cards')
  @ApiOperation({
    summary: 'Get all tarot cards',
    description: 'Returns all 78 tarot cards (22 Major Arcana + 56 Minor Arcana).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all tarot cards',
  })
  getAllCards(): TarotCard[] {
    return this.tarotService.getAllCards();
  }

  /**
   * Get Major Arcana cards
   */
  @Get('cards/major')
  @ApiOperation({
    summary: 'Get Major Arcana cards',
    description: 'Returns all 22 Major Arcana cards.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of Major Arcana cards',
  })
  getMajorArcana(): TarotCard[] {
    return this.tarotService.getMajorArcana();
  }

  /**
   * Get Minor Arcana cards
   */
  @Get('cards/minor')
  @ApiOperation({
    summary: 'Get Minor Arcana cards',
    description: 'Returns all 56 Minor Arcana cards.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of Minor Arcana cards',
  })
  getMinorArcana(): TarotCard[] {
    return this.tarotService.getMinorArcana();
  }

  /**
   * Get cards by suit
   */
  @Get('cards/suit/:suit')
  @ApiOperation({
    summary: 'Get cards by suit',
    description: 'Returns all 14 cards of a specific suit.',
  })
  @ApiParam({
    name: 'suit',
    description: 'Card suit',
    enum: ['cups', 'pentacles', 'swords', 'wands'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of cards in the specified suit',
  })
  getCardsBySuit(@Param('suit') suit: Suit): TarotCard[] {
    return this.tarotService.getCardsBySuit(suit);
  }

  // ==================== SPREADS ====================

  /**
   * Get available spread types
   */
  @Get('spreads')
  @ApiOperation({
    summary: 'Get available spread types',
    description: 'Returns information about available tarot spreads (single card, three cards, Celtic cross).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available spread types',
  })
  getSpreads(): SpreadType[] {
    return this.tarotService.getSpreads();
  }

  // ==================== SUIT INFORMATION ====================

  /**
   * Get suit information
   */
  @Get('suits')
  @ApiOperation({
    summary: 'Get suit information',
    description: 'Returns information about the four suits of the Minor Arcana.',
  })
  @ApiResponse({
    status: 200,
    description: 'Suit information',
  })
  getSuitsInfo() {
    return SUIT_INFO;
  }

  /**
   * Get specific suit information
   */
  @Get('suits/:suit')
  @ApiOperation({
    summary: 'Get specific suit information',
    description: 'Returns detailed information about a specific suit.',
  })
  @ApiParam({
    name: 'suit',
    description: 'Card suit',
    enum: ['cups', 'pentacles', 'swords', 'wands'],
  })
  @ApiResponse({
    status: 200,
    description: 'Suit details',
  })
  getSuitInfo(@Param('suit') suit: Suit) {
    return this.tarotService.getSuitInfo(suit);
  }
}
