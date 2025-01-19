import { TUserRole } from '../types';
import {
  IsString,
  IsEmail,
  IsDate,
  IsArray,
  IsEnum,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const USER_ROLES = ['admin:exams', 'admin:users', 'user', 'public'] as const;

export class UpdateUserProfileDto {
  @ApiProperty({ description: 'Username', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Creation date' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'User roles', enum: USER_ROLES, isArray: true })
  @IsArray()
  @IsEnum(USER_ROLES, { each: true })
  roles: TUserRole[];
  //   password: string;
}
