import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsUUID,
  IsInt,
  IsEnum,
  Min,
  ArrayMinSize,
  MaxLength,
  MinLength,
  Matches,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DayOfWeek } from '../entities/instructional-course.entity';

export class UpdateInstructionalCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finish_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm in 24-hour format',
  })
  start_time_utc?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes?: number;

  @ApiProperty({ enum: DayOfWeek, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(DayOfWeek, { each: true })
  days_of_week?: DayOfWeek[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  institution_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  instructor_id?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  proctor_ids?: string[];
}
