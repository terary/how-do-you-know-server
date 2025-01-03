import { IsString, IsEmail, IsArray } from 'class-validator';
import { TUserRole } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User roles',
    example: ['student', 'teacher'],
    isArray: true,
    enum: ['student', 'teacher', 'admin'],
  })
  @IsArray()
  roles: TUserRole[];
}
