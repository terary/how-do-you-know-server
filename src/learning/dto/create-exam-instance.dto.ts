import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamInstanceType } from '../entities/exam-instance.entity';

export class CreateExamInstanceDto {
  @ApiProperty({ enum: ExamInstanceType })
  @IsEnum(ExamInstanceType)
  type: ExamInstanceType;

  @ApiProperty()
  @IsUUID()
  template_id: string;

  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsDateString()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  end_date: Date;
}
