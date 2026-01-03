import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MAJOR_ARCANA, TarotCard, getMajorArcanaById } from './data/major-arcana.data';
import { MINOR_ARCANA, getMinorArcanaById, Suit, SUIT_INFO } from './data/minor-arcana.data';
import {
  DrawCardDto,
  DrawnCard,
  TarotReadingResponseDto,
  DailyCardResponseDto,
  SpreadType,
  SPREAD_TYPES,
  getSpreadTypeById,
} from './dto/draw-card.dto';

/**
 * TarotService - Main service for tarot card operations
 *
 * Provides functionality for:
 * - Daily card draws (consistent per user per day)
 * - Custom spreads (1, 3, or 10 cards)
 * - Card details and information
 * - Spread type information
 */
@Injectable()
export class TarotService {
  private readonly logger = new Logger(TarotService.name);

  /**
   * Get all cards (both Major and Minor Arcana)
   */
  getAllCards(): TarotCard[] {
    return [...MAJOR_ARCANA, ...MINOR_ARCANA];
  }

  /**
   * Get all Major Arcana cards
   */
  getMajorArcana(): TarotCard[] {
    return MAJOR_ARCANA;
  }

  /**
   * Get all Minor Arcana cards
   */
  getMinorArcana(): TarotCard[] {
    return MINOR_ARCANA;
  }

  /**
   * Get cards by suit
   */
  getCardsBySuit(suit: Suit): TarotCard[] {
    return MINOR_ARCANA.filter(card => card.suit === suit);
  }

  /**
   * Get a specific card by ID
   */
  getCardById(cardId: string): TarotCard {
    const card = getMajorArcanaById(cardId) || getMinorArcanaById(cardId);

    if (!card) {
      throw new NotFoundException(`Carta com ID '${cardId}' nao encontrada`);
    }

    return card;
  }

  /**
   * Get daily card for a user
   * Uses date + userId hash to ensure consistent card for the day
   */
  getDailyCard(userId?: string): DailyCardResponseDto {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    this.logger.log(`Getting daily card for user: ${userId || 'anonymous'} on ${dateString}`);

    // Create a seed based on date and userId for consistent daily card
    const seed = this.createSeed(dateString, userId || 'anonymous');
    const allCards = this.getAllCards();

    // Select card based on seed
    const cardIndex = seed % allCards.length;
    const card = allCards[cardIndex];

    // Determine if reversed based on seed
    const isReversed = (seed % 3) === 0; // ~33% chance of reversed

    // Generate daily guidance
    const dailyGuidance = this.generateDailyGuidance(card, isReversed);
    const affirmation = this.generateDailyAffirmation(card, isReversed);

    return {
      card,
      isReversed,
      dailyGuidance,
      affirmation,
      date: dateString,
      alreadyDrew: false,
    };
  }

  /**
   * Draw cards for a custom spread
   */
  drawCards(dto: DrawCardDto): TarotReadingResponseDto {
    const { numberOfCards, spreadType, includeReversed = true, question } = dto;

    this.logger.log(`Drawing ${numberOfCards} cards for spread: ${spreadType || 'custom'}`);

    // Determine spread type
    let spread: SpreadType | undefined;
    if (spreadType) {
      spread = getSpreadTypeById(spreadType);
    } else {
      // Auto-select based on number of cards
      if (numberOfCards === 1) {
        spread = getSpreadTypeById('single');
      } else if (numberOfCards === 3) {
        spread = getSpreadTypeById('past-present-future');
      } else {
        spread = getSpreadTypeById('celtic-cross');
      }
    }

    // Fallback to single card spread if spread not found
    if (!spread) {
      spread = SPREAD_TYPES[0];
    }

    // Draw random cards
    const allCards = this.getAllCards();
    const shuffledCards = this.shuffleArray([...allCards]);
    const drawnCards: DrawnCard[] = [];

    for (let i = 0; i < numberOfCards && i < shuffledCards.length; i++) {
      const card = shuffledCards[i];
      const isReversed = includeReversed ? Math.random() > 0.5 : false;
      const position = spread.positions[i];

      drawnCards.push({
        card,
        isReversed,
        position: i + 1,
        positionName: position?.name || `Carta ${i + 1}`,
        positionInterpretation: this.generatePositionInterpretation(
          card,
          isReversed,
          position?.meaning || '',
        ),
      });
    }

    // Generate overall guidance
    const overallGuidance = this.generateOverallGuidance(drawnCards, question);

    return {
      cards: drawnCards,
      spreadType: spread.id,
      spreadName: spread.name,
      question,
      overallGuidance,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get all available spread types
   */
  getSpreads(): SpreadType[] {
    return SPREAD_TYPES;
  }

  /**
   * Get suit information
   */
  getSuitInfo(suit: Suit) {
    return SUIT_INFO[suit];
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Create a deterministic seed from date and userId
   */
  private createSeed(dateString: string, userId: string): number {
    const combined = `${dateString}-${userId}`;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Generate daily guidance based on card
   */
  private generateDailyGuidance(card: TarotCard, isReversed: boolean): string {
    const greeting = this.getTimeGreeting();
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
    const position = isReversed ? 'invertida' : 'na posicao normal';

    return `${greeting}! Sua carta do dia e ${card.name}, ${position}. ${meaning} ${card.advice}`;
  }

  /**
   * Generate daily affirmation based on card
   */
  private generateDailyAffirmation(card: TarotCard, isReversed: boolean): string {
    const affirmations: Record<string, string[]> = {
      default: [
        'Eu confio na minha jornada e nas mensagens do universo.',
        'Hoje, eu escolho abracar as licoes que a vida me apresenta.',
        'Eu sou guiado pela sabedoria do meu eu superior.',
        'Cada desafio e uma oportunidade de crescimento.',
        'Eu estou exatamente onde preciso estar.',
      ],
    };

    // Get a consistent affirmation based on card
    const seed = card.number || 0;
    const affirmationList = affirmations.default;
    const index = seed % affirmationList.length;

    return affirmationList[index];
  }

  /**
   * Get time-appropriate greeting
   */
  private getTimeGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  /**
   * Generate interpretation for card in specific position
   */
  private generatePositionInterpretation(
    card: TarotCard,
    isReversed: boolean,
    positionMeaning: string,
  ): string {
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
    const position = isReversed ? '(invertida)' : '';

    if (!positionMeaning) {
      return `${card.name} ${position}: ${meaning}`;
    }

    return `Na posicao de "${positionMeaning}", ${card.name} ${position} sugere: ${meaning}`;
  }

  /**
   * Generate overall guidance based on all drawn cards
   */
  private generateOverallGuidance(cards: DrawnCard[], question?: string): string {
    const cardNames = cards.map(c =>
      `${c.card.name}${c.isReversed ? ' (invertida)' : ''}`,
    ).join(', ');

    const majorArcanaCount = cards.filter(c => c.card.suit === null).length;
    const hasReversed = cards.some(c => c.isReversed);

    let guidance = '';

    // Opening based on question or general
    if (question) {
      guidance += `Sobre sua pergunta "${question}": `;
    } else {
      guidance += 'Sua leitura revela: ';
    }

    // Comment on Major Arcana presence
    if (majorArcanaCount > cards.length / 2) {
      guidance += 'A forte presenca de Arcanos Maiores indica que forcas espirituais significativas estao em jogo. ';
    } else if (majorArcanaCount === 0) {
      guidance += 'A ausencia de Arcanos Maiores sugere que esta e uma situacao mais cotidiana, sob seu controle direto. ';
    }

    // Comment on reversed cards
    if (hasReversed) {
      guidance += 'As cartas invertidas indicam areas que requerem atencao especial ou bloqueios a serem superados. ';
    }

    // Add card summary
    guidance += `As cartas ${cardNames} se combinam para mostrar que este e um momento de `;

    // Analyze predominant themes
    const themes = this.analyzeThemes(cards);
    guidance += themes.join(' e ') + '. ';

    // Closing advice
    guidance += cards[cards.length - 1].card.advice;

    return guidance;
  }

  /**
   * Analyze predominant themes in drawn cards
   */
  private analyzeThemes(cards: DrawnCard[]): string[] {
    const themes: string[] = [];

    // Check for suit predominance
    const suitCounts: Record<string, number> = {};
    cards.forEach(c => {
      const suit = c.card.suit || 'major';
      suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });

    const predominantSuit = Object.entries(suitCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (predominantSuit[1] >= 2) {
      switch (predominantSuit[0]) {
        case 'cups':
          themes.push('foco em emocoes e relacionamentos');
          break;
        case 'pentacles':
          themes.push('atencao a questoes materiais e praticas');
          break;
        case 'swords':
          themes.push('desafios mentais e decisoes');
          break;
        case 'wands':
          themes.push('energia criativa e acao');
          break;
        case 'major':
          themes.push('transformacoes espirituais significativas');
          break;
      }
    }

    // Add default theme if none found
    if (themes.length === 0) {
      themes.push('equilibrio e diversidade de experiencias');
    }

    // Check for challenging cards
    const challengingCards = cards.filter(c =>
      c.isReversed ||
      ['major-13', 'major-15', 'major-16', 'swords-3', 'swords-9', 'swords-10'].includes(c.card.id),
    );

    if (challengingCards.length >= 2) {
      themes.push('superacao de desafios');
    }

    // Check for positive cards
    const positiveCards = cards.filter(c =>
      !c.isReversed &&
      ['major-17', 'major-19', 'major-21', 'cups-9', 'cups-10', 'wands-6'].includes(c.card.id),
    );

    if (positiveCards.length >= 2) {
      themes.push('bencaos e realizacoes');
    }

    return themes;
  }
}
