import {
  IsDateString,
  IsString,
  IsOptional,
  Matches,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for geographic coordinates
 */
export class CoordinatesDto {
  @ApiProperty({
    description: 'Latitude of birth location',
    example: -23.5505,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude of birth location',
    example: -46.6333,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

/**
 * DTO for birth data used to calculate natal charts
 */
export class BirthDataDto {
  @ApiPropertyOptional({
    description: 'Name of the person',
    example: 'Maria Silva',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Birth date in ISO format',
    example: '1990-05-15',
  })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({
    description: 'Birth time in HH:mm format (24-hour)',
    example: '14:30',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Birth time must be in HH:mm format',
  })
  birthTime?: string;

  @ApiPropertyOptional({
    description: 'Birth place (city, country)',
    example: 'Sao Paulo, Brazil',
  })
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiPropertyOptional({
    description: 'Geographic coordinates of birth location',
    type: CoordinatesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

/**
 * Extended birth data DTO with additional personal information
 */
export class ExtendedBirthDataDto extends BirthDataDto {
  @ApiProperty({
    description: 'Full name of the person',
    example: 'Maria Silva Santos',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Gender for personalized interpretations',
    enum: ['male', 'female', 'other'],
  })
  @IsString()
  @IsOptional()
  gender?: 'male' | 'female' | 'other';
}

/**
 * DTO for simple date-only calculations (sun sign)
 */
export class DateOnlyDto {
  @ApiProperty({
    description: 'Date in ISO format (YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsDateString()
  date: string;
}

/**
 * DTO for calculating aspects between two charts
 */
export class DualChartRequestDto {
  @ApiProperty({
    description: 'First person birth data',
    type: BirthDataDto,
  })
  @ValidateNested()
  @Type(() => BirthDataDto)
  person1: BirthDataDto;

  @ApiProperty({
    description: 'Second person birth data',
    type: BirthDataDto,
  })
  @ValidateNested()
  @Type(() => BirthDataDto)
  person2: BirthDataDto;
}
