import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, AuthResponseDto } from './dto/login.dto';
import { getZodiacSignFromDate } from '../astrology/types/zodiac.types';

/**
 * Authentication service handling user registration and login
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET', 'default-secret-change-in-production');
    this.jwtExpiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);
  }

  /**
   * Register a new user
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, password, ...userData } = createUserDto;

    // Check if email already exists
    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
      birthDate: new Date(createUserDto.birthDate),
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User registered: ${savedUser.id}`);

    return this.generateAuthResponse(savedUser);
  }

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password not set for this account');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.id}`);
    return this.generateAuthResponse(user);
  }

  /**
   * Validate JWT token and return user
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Refresh user token
   */
  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateAuthResponse(user);
  }

  /**
   * Generate JWT and auth response
   */
  private generateAuthResponse(user: User): AuthResponseDto {
    const sunSign = getZodiacSignFromDate(new Date(user.birthDate));

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });

    return {
      accessToken,
      expiresIn: this.jwtExpiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email || '',
        sunSign,
        subscriptionTier: user.subscriptionTier,
      },
    };
  }
}
