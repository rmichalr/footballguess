import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly SALT_ROUNDS = 10;

  private parsePrismaError(error: unknown): string | null {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      const meta = (error as { meta?: { target?: string[] | string } }).meta;
      if (meta && typeof meta === 'object' && 'target' in meta) {
        const target = Array.isArray(meta.target)
          ? meta.target.join(',')
          : String(meta.target);
        if (target.includes('email')) return 'email';
        if (target.includes('username')) return 'username';
        return 'user';
      }
    }
    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        UsersService.SALT_ROUNDS,
      );

      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          password: hashedPassword,
          isadmin: createUserDto.isadmin || false,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser as User;
    } catch (error) {
      const conflictField = this.parsePrismaError(error);
      if (conflictField === 'email') {
        throw new ConflictException('Email already exists');
      }
      if (conflictField === 'username') {
        throw new ConflictException('Username already exists');
      }
      if (conflictField) {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
