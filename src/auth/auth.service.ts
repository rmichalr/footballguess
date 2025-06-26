import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  createdat: Date;
  isadmin: boolean;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const user = (await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
    })) as UserResponse;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdat: user.createdat,
      isadmin: user.isadmin,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    const user = (await this.usersService.findByEmail(email)) as
      | (UserResponse & { password: string })
      | null;

    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        createdat: user.createdat,
        isadmin: user.isadmin,
      };
    }

    return null;
  }
}
