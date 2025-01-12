import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsInt, Min, MinLength } from 'class-validator';

export class CreateExamTemplateSectionDto {
  @ApiProperty({
    description: 'The title of the exam section',
    example: 'Multiple Choice Questions',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Instructions for this section',
    example:
      'Select the best answer for each question. Each question is worth 2 points.',
  })
  @IsString()
  @MinLength(10)
  instructions: string;

  @ApiProperty({
    description: 'The position of this section in the exam (1-based)',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty({
    description: 'Time limit for this section in seconds',
    example: 1800,
    minimum: 60,
  })
  @IsInt()
  @Min(60)
  timeLimitSeconds: number;

  @ApiProperty({
    description: 'The ID of the exam template this section belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  exam_template_id: string;
}
