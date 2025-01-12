import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ExamExclusivityType } from '../entities/exam-template.entity';

export class UpdateExamTemplateDto {
  @ApiProperty({
    description: 'The name of the exam template',
    example: 'Midterm Exam Template',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'A detailed description of the exam template',
    example: 'Template for the midterm examination covering chapters 1-5',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty({
    description: 'The type of exam exclusivity',
    enum: ['exam-only', 'practice-only', 'exam-practice-both'],
    example: 'exam-practice-both',
    required: false,
  })
  @IsOptional()
  @IsEnum(['exam-only', 'practice-only', 'exam-practice-both'])
  examExclusivityType?: ExamExclusivityType;

  @ApiProperty({
    description: 'The start date when this exam becomes available',
    example: '2024-03-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  availability_start_date?: Date;

  @ApiProperty({
    description: 'The end date when this exam becomes unavailable',
    example: '2024-03-20T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  availability_end_date?: Date;
}
