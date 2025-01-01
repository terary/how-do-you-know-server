import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { TAuthenticatedUser, TUserRole } from 'src/users/types';

export class SignOutDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john',
  })
  username: string;

  @ApiProperty({
    description: 'Password for authentication',
    example: 'changeme',
  })
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({
    username,
    password,
  }: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.username, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signOut({ access_token }: SignOutDto): Promise<boolean> {
    return Promise.resolve(true);
  }

  async getProfile(username: string): Promise<TAuthenticatedUser> {
    return this.usersService.findOne(username);
  }

  async updateUserProfile(username: string, updateUserDto: TUserRole) {
    const propertyNames = [
      // 'username',
      'firstName',
      'lastName',
      'email',
      // 'createdAt',
      // 'updatedAt',
      // 'roles',
    ];
    const user = await this.usersService.findOne(username);
    const allowedUpdates = propertyNames.reduce((acc, property) => {
      if (updateUserDto[property] !== undefined) {
        acc[property] = updateUserDto[property];
      }
      return acc;
    }, {});
    const updatedUser = await this.usersService.updateUserProfile(
      username,
      allowedUpdates,
    );
    return updatedUser;
  }
}
