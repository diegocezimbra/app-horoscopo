import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
  CelebrityDto,
  ProfileType,
} from './dto/profile.dto';
import { JwtGuard, JwtUser } from '../auth/guards/jwt.guard';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * Get all profiles for the authenticated user
   */
  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all profiles for the current user' })
  @ApiResponse({ status: 200, description: 'List of profiles', type: [ProfileResponseDto] })
  async getAllProfiles(@Request() req: { user: JwtUser }): Promise<ProfileResponseDto[]> {
    return this.profilesService.getAllProfiles(req.user.id);
  }

  /**
   * Get main profile for the authenticated user
   */
  @Get('main')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get main profile for the current user' })
  @ApiResponse({ status: 200, description: 'Main profile', type: ProfileResponseDto })
  async getMainProfile(@Request() req: { user: JwtUser }): Promise<ProfileResponseDto | null> {
    return this.profilesService.getMainProfile(req.user.id);
  }

  /**
   * Get profile by ID
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Profile details', type: ProfileResponseDto })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(
    @Request() req: { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.getProfileById(req.user.id, id);
  }

  /**
   * Get profiles by type
   */
  @Get('type/:type')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profiles by type' })
  @ApiParam({ name: 'type', enum: ['main', 'partner', 'child', 'friend', 'crush', 'celebrity'] })
  @ApiResponse({ status: 200, description: 'Profiles of specified type', type: [ProfileResponseDto] })
  async getProfilesByType(
    @Request() req: { user: JwtUser },
    @Param('type') type: ProfileType,
  ): Promise<ProfileResponseDto[]> {
    return this.profilesService.getProfilesByType(req.user.id, type);
  }

  /**
   * Create a new profile
   */
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({ status: 201, description: 'Profile created', type: ProfileResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or main profile already exists' })
  async createProfile(
    @Request() req: { user: JwtUser },
    @Body() dto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.createProfile(req.user.id, dto);
  }

  /**
   * Update a profile
   */
  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a profile' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Profile updated', type: ProfileResponseDto })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Request() req: { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.updateProfile(req.user.id, id, dto);
  }

  /**
   * Delete a profile (cannot delete main profile)
   */
  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Profile deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete main profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async deleteProfile(
    @Request() req: { user: JwtUser },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.profilesService.deleteProfile(req.user.id, id);
  }

  /**
   * Search celebrities
   */
  @Get('celebrities/search')
  @ApiOperation({ summary: 'Search celebrities' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'List of celebrities', type: [CelebrityDto] })
  async searchCelebrities(@Query('q') query?: string): Promise<CelebrityDto[]> {
    return this.profilesService.searchCelebrities(query);
  }
}
