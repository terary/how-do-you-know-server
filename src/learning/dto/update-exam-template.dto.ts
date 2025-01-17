import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ExamExclusivityType } from '../entities/exam-template.entity';

export class UpdateExamTemplateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  course_id?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  availability_start_date?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  availability_end_date?: Date;

  @ApiProperty({ required: false, enum: ExamExclusivityType })
  @IsEnum(ExamExclusivityType)
  @IsOptional()
  examExclusivityType?: ExamExclusivityType;
}
