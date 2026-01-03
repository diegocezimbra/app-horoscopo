import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TarotCard } from '../data/major-arcana.data';

/**
 * DTO for drawing tarot cards
 */
export class DrawCardDto {
  @ApiProperty({
    description: 'Number of cards to draw (1, 3, or 10)',
    example: 3,
    enum: [1, 3, 10],
  })
  @IsNumber()
  @IsIn([1, 3, 10], { message: 'O numero de cartas deve ser 1, 3 ou 10' })
  numberOfCards: number;

  @ApiPropertyOptional({
    description: 'Type of spread',
    example: 'past-present-future',
    enum: ['single', 'past-present-future', 'celtic-cross'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['single', 'past-present-future', 'celtic-cross'])
  spreadType?: 'single' | 'past-present-future' | 'celtic-cross';

  @ApiPropertyOptional({
    description: 'Whether to include reversed card meanings',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeReversed?: boolean;

  @ApiPropertyOptional({
    description: 'Specific question for the reading',
    example: 'What should I focus on this week?',
  })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional({
    description: 'User ID for consistent daily card',
    example: 'user-123',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

/**
 * Interface for a drawn card with position info
 */
export interface DrawnCard {
  /** The card data */
  card: TarotCard;
  /** Whether the card is reversed */
  isReversed: boolean;
  /** Position in the spread */
  position: number;
  /** Position name/meaning in the spread */
  positionName: string;
  /** Interpretation based on position */
  positionInterpretation: string;
}

/**
 * Interface for spread types
 */
export interface SpreadType {
  /** Unique identifier */
  id: string;
  /** Display name in Portuguese */
  name: string;
  /** Description of the spread */
  description: string;
  /** Number of cards in the spread */
  numberOfCards: number;
  /** Position names for each card */
  positions: SpreadPosition[];
  /** Recommended use cases */
  recommendedFor: string[];
  /** Image URL for the spread layout */
  imageUrl: string;
}

/**
 * Interface for spread positions
 */
export interface SpreadPosition {
  /** Position number (1-based) */
  position: number;
  /** Name of the position */
  name: string;
  /** What this position represents */
  meaning: string;
}

/**
 * Response DTO for tarot reading
 */
export class TarotReadingResponseDto {
  @ApiProperty({
    description: 'Cards drawn in the reading',
    type: 'array',
  })
  cards: DrawnCard[];

  @ApiProperty({
    description: 'Spread type used',
    example: 'past-present-future',
  })
  spreadType: string;

  @ApiProperty({
    description: 'Spread name in Portuguese',
    example: 'Passado, Presente e Futuro',
  })
  spreadName: string;

  @ApiPropertyOptional({
    description: 'Question asked for the reading',
  })
  question?: string;

  @ApiProperty({
    description: 'General guidance based on all cards',
  })
  overallGuidance: string;

  @ApiProperty({
    description: 'Timestamp of the reading',
  })
  timestamp: string;
}

/**
 * Response DTO for daily card
 */
export class DailyCardResponseDto {
  @ApiProperty({
    description: 'The daily card',
  })
  card: TarotCard;

  @ApiProperty({
    description: 'Whether the card is reversed',
    example: false,
  })
  isReversed: boolean;

  @ApiProperty({
    description: 'Daily guidance message',
  })
  dailyGuidance: string;

  @ApiProperty({
    description: 'Affirmation for the day',
  })
  affirmation: string;

  @ApiProperty({
    description: 'Date for this card',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Whether user already drew a card today',
    example: false,
  })
  alreadyDrew: boolean;
}

/**
 * DTO for card details request
 */
export class CardDetailsDto {
  @ApiProperty({
    description: 'Card ID',
    example: 'major-0',
  })
  @IsString()
  cardId: string;
}

/**
 * Available spread types data
 */
export const SPREAD_TYPES: SpreadType[] = [
  {
    id: 'single',
    name: 'Carta Unica',
    description: 'Uma unica carta para orientacao rapida ou resposta direta a uma pergunta simples.',
    numberOfCards: 1,
    positions: [
      {
        position: 1,
        name: 'A Mensagem',
        meaning: 'A orientacao principal do universo para voce neste momento.',
      },
    ],
    recommendedFor: [
      'Perguntas simples de sim/nao',
      'Orientacao diaria',
      'Meditacao',
      'Reflexao rapida',
    ],
    imageUrl: '/images/tarot/spreads/single.jpg',
  },
  {
    id: 'past-present-future',
    name: 'Passado, Presente e Futuro',
    description: 'Tres cartas revelando a influencia do passado, a situacao atual e as tendencias futuras.',
    numberOfCards: 3,
    positions: [
      {
        position: 1,
        name: 'Passado',
        meaning: 'Influencias e eventos passados que moldaram a situacao atual.',
      },
      {
        position: 2,
        name: 'Presente',
        meaning: 'A situacao atual, desafios e oportunidades do momento.',
      },
      {
        position: 3,
        name: 'Futuro',
        meaning: 'Tendencias e possibilidades que se desenrolam baseadas no caminho atual.',
      },
    ],
    recommendedFor: [
      'Compreender uma situacao',
      'Ver a evolucao de um assunto',
      'Decisoes importantes',
      'Reflexao sobre o caminho',
    ],
    imageUrl: '/images/tarot/spreads/three-cards.jpg',
  },
  {
    id: 'celtic-cross',
    name: 'Cruz Celtica',
    description: 'A tiragem mais completa e tradicional do Taro, oferecendo uma visao profunda e detalhada de qualquer situacao.',
    numberOfCards: 10,
    positions: [
      {
        position: 1,
        name: 'Situacao Atual',
        meaning: 'O coracao da questao - sua situacao presente.',
      },
      {
        position: 2,
        name: 'O Desafio',
        meaning: 'O obstaculo imediato ou influencia que cruza seu caminho.',
      },
      {
        position: 3,
        name: 'Fundacao',
        meaning: 'As raizes da situacao - o que esta abaixo da superficie.',
      },
      {
        position: 4,
        name: 'Passado Recente',
        meaning: 'Eventos recentes que influenciaram a situacao atual.',
      },
      {
        position: 5,
        name: 'Possibilidades',
        meaning: 'O melhor resultado possivel que pode ser alcancado.',
      },
      {
        position: 6,
        name: 'Futuro Proximo',
        meaning: 'Eventos que se aproximam no horizonte imediato.',
      },
      {
        position: 7,
        name: 'Voce',
        meaning: 'Sua atitude atual e como voce se ve na situacao.',
      },
      {
        position: 8,
        name: 'Ambiente Externo',
        meaning: 'Influencias externas - pessoas e circunstâncias ao seu redor.',
      },
      {
        position: 9,
        name: 'Esperancas e Medos',
        meaning: 'Seus desejos e receios mais profundos sobre a situacao.',
      },
      {
        position: 10,
        name: 'Resultado Final',
        meaning: 'O desfecho mais provavel se o caminho atual for mantido.',
      },
    ],
    recommendedFor: [
      'Questoes complexas',
      'Decisoes de vida importantes',
      'Compreensao profunda',
      'Leituras detalhadas',
    ],
    imageUrl: '/images/tarot/spreads/celtic-cross.jpg',
  },
];

/**
 * Get spread type by ID
 */
export function getSpreadTypeById(id: string): SpreadType | undefined {
  return SPREAD_TYPES.find(spread => spread.id === id);
}
