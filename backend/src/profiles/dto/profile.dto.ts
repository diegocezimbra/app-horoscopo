import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ProfileType = 'main' | 'partner' | 'child' | 'friend' | 'crush' | 'celebrity';

export type ZodiacSignId =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export class CreateProfileDto {
  @ApiProperty({ enum: ['main', 'partner', 'child', 'friend', 'crush', 'celebrity'] })
  @IsEnum(['main', 'partner', 'child', 'friend', 'crush', 'celebrity'])
  type: ProfileType;

  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '1990-05-15' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ example: '14:30' })
  @IsString()
  @IsOptional()
  birthTime?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo, Brazil' })
  @IsString()
  @IsOptional()
  birthPlace?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Maria Silva' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ example: '14:30' })
  @IsString()
  @IsOptional()
  birthTime?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo, Brazil' })
  @IsString()
  @IsOptional()
  birthPlace?: string;
}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['main', 'partner', 'child', 'friend', 'crush', 'celebrity'] })
  type: ProfileType;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  birthDate: string;

  @ApiPropertyOptional()
  birthTime?: string;

  @ApiPropertyOptional()
  birthPlace?: string;

  @ApiProperty({ enum: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] })
  sunSign: ZodiacSignId;

  @ApiPropertyOptional()
  moonSign?: ZodiacSignId;

  @ApiPropertyOptional()
  ascendant?: ZodiacSignId;

  @ApiProperty({ type: [String] })
  traits: string[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class CelebrityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthDate: string;

  @ApiProperty()
  sunSign: ZodiacSignId;

  @ApiProperty({ type: [String] })
  traits: string[];

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  profession?: string;
}
