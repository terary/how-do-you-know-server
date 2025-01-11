import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateLearningInstitutionDto {
  @ApiProperty({
    description: 'The name of the learning institution',
    example: 'University of Example',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'A detailed description of the learning institution',
    example: 'A leading institution in computer science education...',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty({
    description: 'The website URL of the learning institution',
    example: 'https://www.example-university.edu',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'The contact email for the learning institution',
    example: 'contact@example-university.edu',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The contact phone number for the learning institution',
    example: '+1-234-567-8900',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s-]+$/, {
    message:
      'Phone number must contain only digits, spaces, hyphens, and optionally start with +',
  })
  phone?: string;

  @ApiProperty({
    description: 'The physical address of the learning institution',
    example: '123 University Ave, Example City, EX 12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string;
}
