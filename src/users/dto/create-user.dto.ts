import { IsString, IsEmail, IsArray } from 'class-validator';
import { TUserRole } from '../types';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  roles: TUserRole[];
}
