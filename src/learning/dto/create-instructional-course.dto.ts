import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsUUID,
  IsInt,
  IsEnum,
  Min,
  ArrayMinSize,
  MinLength,
  MaxLength,
  Matches,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '../entities/instructional-course.entity';

export class CreateInstructionalCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  finish_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
  start_time_utc: string;

  @ApiProperty()
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes: number;

  @ApiProperty({ enum: DayOfWeek, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DayOfWeek, { each: true })
  days_of_week: DayOfWeek[];

  @ApiProperty()
  @IsUUID()
  institution_id: string;

  @ApiProperty()
  @IsUUID()
  instructor_id: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  proctor_ids?: string[];
}
