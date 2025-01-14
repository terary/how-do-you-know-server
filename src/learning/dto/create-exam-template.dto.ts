import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDateString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ExamExclusivityType } from '../entities/exam-template.entity';

export class CreateExamTemplateDto {
  @ApiProperty({
    description: 'The name of the exam template',
    example: 'Midterm Exam Template',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'A detailed description of the exam template',
    example: 'Template for the midterm examination covering chapters 1-5',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'The type of exam exclusivity',
    enum: ExamExclusivityType,
    example: 'exam-practice-both',
  })
  @IsEnum(ExamExclusivityType)
  examExclusivityType: ExamExclusivityType;

  @ApiProperty({
    description: 'The start date when this exam becomes available',
    example: '2024-03-15T00:00:00Z',
  })
  @IsDateString()
  availability_start_date: Date;

  @ApiProperty({
    description: 'The end date when this exam becomes unavailable',
    example: '2024-03-20T23:59:59Z',
  })
  @IsDateString()
  availability_end_date: Date;

  @ApiProperty({
    description: 'The ID of the course this exam belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  course_id: string;
}
