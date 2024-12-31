import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: "The user's display name",
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  displayName?: string;

  @ApiProperty({
    description: "The user's email address",
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
