import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new user account
 */
export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User password (min 8 characters)',
    example: 'securePassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'User display name',
    example: 'Maria Silva',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User gender',
    enum: ['male', 'female'],
    example: 'female',
  })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({
    description: 'User birth date in ISO format',
    example: '1990-05-15',
  })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({
    description: 'User birth time in HH:mm format',
    example: '14:30',
  })
  @IsString()
  @IsOptional()
  birthTime?: string;

  @ApiPropertyOptional({
    description: 'User birth place (city, country)',
    example: 'Sao Paulo, Brazil',
  })
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiPropertyOptional({
    description: 'User interests for personalized content',
    example: ['love', 'career', 'health'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({
    description: 'Quiz answers for personalization',
    example: { q1: 'a', q2: 'c' },
  })
  @IsOptional()
  quizAnswers?: Record<string, string>;
}
