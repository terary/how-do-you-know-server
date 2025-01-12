import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MinLength, IsOptional } from 'class-validator';

export class UpdateExamTemplateSectionDto {
  @ApiProperty({
    description: 'The title of the exam section',
    example: 'Multiple Choice Questions',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({
    description: 'Instructions for this section',
    example:
      'Select the best answer for each question. Each question is worth 2 points.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  instructions?: string;

  @ApiProperty({
    description: 'The position of this section in the exam (1-based)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @ApiProperty({
    description: 'Time limit for this section in seconds',
    example: 1800,
    minimum: 60,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(60)
  timeLimitSeconds?: number;
}
