import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.debug('User not found');
      throw new UnauthorizedException('User not found');
    }

    this.logger.debug('User found, details:', {
      username: user.username,
      roles: user.roles,
      passwordLength: user.password.length,
      passwordStart: user.password.substring(0, 10),
    });

    this.logger.debug('Comparing passwords:', {
      providedPassword: pass,
      storedPasswordStart: user.password.substring(0, 10),
    });

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    this.logger.debug(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
