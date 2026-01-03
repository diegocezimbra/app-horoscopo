import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Celebrity } from './entities/celebrity.entity';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
  CelebrityDto,
  ZodiacSignId,
  ProfileType,
} from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Celebrity)
    private readonly celebrityRepository: Repository<Celebrity>,
  ) {}

  /**
   * Get zodiac sign from birth date
   */
  private getZodiacSignFromDate(birthDate: string): ZodiacSignId {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
  }

  /**
   * Generate personality traits based on zodiac sign
   */
  private generateTraits(signId: ZodiacSignId): string[] {
    const traitsMap: Record<ZodiacSignId, string[]> = {
      aries: ['Corajoso', 'Energetico', 'Lider nato', 'Impulsivo', 'Aventureiro'],
      taurus: ['Determinado', 'Leal', 'Paciente', 'Sensual', 'Pratico'],
      gemini: ['Comunicativo', 'Curioso', 'Versatil', 'Inteligente', 'Adaptavel'],
      cancer: ['Sensivel', 'Protetor', 'Intuitivo', 'Carinhoso', 'Familiar'],
      leo: ['Carismatico', 'Generoso', 'Criativo', 'Dramatico', 'Lider'],
      virgo: ['Analitico', 'Perfeccionista', 'Prestativo', 'Organizado', 'Pratico'],
      libra: ['Diplomatico', 'Harmonioso', 'Justo', 'Social', 'Romantico'],
      scorpio: ['Intenso', 'Misterioso', 'Passional', 'Estrategico', 'Leal'],
      sagittarius: ['Otimista', 'Aventureiro', 'Filosofico', 'Honesto', 'Livre'],
      capricorn: ['Ambicioso', 'Disciplinado', 'Responsavel', 'Tradicional', 'Paciente'],
      aquarius: ['Inovador', 'Independente', 'Humanitario', 'Original', 'Rebelde'],
      pisces: ['Sonhador', 'Compassivo', 'Artistico', 'Intuitivo', 'Romantico'],
    };

    return traitsMap[signId] || [];
  }

  /**
   * Transform entity to response DTO
   */
  private toResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      type: profile.type as ProfileType,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      birthPlace: profile.birthPlace,
      sunSign: profile.sunSign as ZodiacSignId,
      moonSign: profile.moonSign as ZodiacSignId | undefined,
      ascendant: profile.ascendant as ZodiacSignId | undefined,
      traits: profile.traits,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  /**
   * Get all profiles for a user
   */
  async getAllProfiles(userId: string): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    return profiles.map((p) => this.toResponseDto(p));
  }

  /**
   * Get main profile for a user
   */
  async getMainProfile(userId: string): Promise<ProfileResponseDto | null> {
    const profile = await this.profileRepository.findOne({
      where: { userId, type: 'main' },
    });

    return profile ? this.toResponseDto(profile) : null;
  }

  /**
   * Get profile by ID
   */
  async getProfileById(userId: string, profileId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId, userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil nao encontrado');
    }

    return this.toResponseDto(profile);
  }

  /**
   * Create a new profile
   */
  async createProfile(userId: string, dto: CreateProfileDto): Promise<ProfileResponseDto> {
    // Check if main profile already exists
    if (dto.type === 'main') {
      const existingMain = await this.profileRepository.findOne({
        where: { userId, type: 'main' },
      });
      if (existingMain) {
        throw new BadRequestException('Ja existe um perfil principal');
      }
    }

    const sunSign = this.getZodiacSignFromDate(dto.birthDate);
    const traits = this.generateTraits(sunSign);

    const profile = this.profileRepository.create({
      userId,
      type: dto.type,
      name: dto.name,
      avatarUrl: dto.avatarUrl,
      birthDate: dto.birthDate,
      birthTime: dto.birthTime,
      birthPlace: dto.birthPlace,
      sunSign,
      traits,
    });

    const saved = await this.profileRepository.save(profile);
    return this.toResponseDto(saved);
  }

  /**
   * Update a profile
   */
  async updateProfile(
    userId: string,
    profileId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId, userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil nao encontrado');
    }

    // Update fields
    if (dto.name !== undefined) profile.name = dto.name;
    if (dto.avatarUrl !== undefined) profile.avatarUrl = dto.avatarUrl;
    if (dto.birthDate !== undefined) {
      profile.birthDate = dto.birthDate;
      profile.sunSign = this.getZodiacSignFromDate(dto.birthDate);
      profile.traits = this.generateTraits(profile.sunSign as ZodiacSignId);
    }
    if (dto.birthTime !== undefined) profile.birthTime = dto.birthTime;
    if (dto.birthPlace !== undefined) profile.birthPlace = dto.birthPlace;

    const saved = await this.profileRepository.save(profile);
    return this.toResponseDto(saved);
  }

  /**
   * Delete a profile (cannot delete main profile)
   */
  async deleteProfile(userId: string, profileId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId, userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil nao encontrado');
    }

    if (profile.type === 'main') {
      throw new BadRequestException('Nao e possivel excluir o perfil principal');
    }

    await this.profileRepository.remove(profile);
  }

  /**
   * Get profiles by type
   */
  async getProfilesByType(userId: string, type: ProfileType): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository.find({
      where: { userId, type },
      order: { createdAt: 'ASC' },
    });

    return profiles.map((p) => this.toResponseDto(p));
  }

  /**
   * Search celebrities
   */
  async searchCelebrities(query?: string): Promise<CelebrityDto[]> {
    let celebrities: Celebrity[];

    if (query) {
      celebrities = await this.celebrityRepository
        .createQueryBuilder('celebrity')
        .where('LOWER(celebrity.name) LIKE LOWER(:query)', { query: `%${query}%` })
        .orderBy('celebrity.name', 'ASC')
        .limit(20)
        .getMany();
    } else {
      celebrities = await this.celebrityRepository.find({
        order: { name: 'ASC' },
        take: 20,
      });
    }

    return celebrities.map((c) => ({
      id: c.id,
      name: c.name,
      birthDate: c.birthDate,
      sunSign: c.sunSign as ZodiacSignId,
      traits: c.traits,
      imageUrl: c.imageUrl,
      profession: c.profession,
    }));
  }
}
