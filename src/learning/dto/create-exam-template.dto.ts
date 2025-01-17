import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { ExamExclusivityType } from '../entities/exam-template.entity';

export class CreateExamTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsDateString()
  availability_start_date: Date;

  @ApiProperty()
  @IsDateString()
  availability_end_date: Date;

  @ApiProperty({ enum: ExamExclusivityType })
  @IsEnum(ExamExclusivityType)
  examExclusivityType: ExamExclusivityType;
}
