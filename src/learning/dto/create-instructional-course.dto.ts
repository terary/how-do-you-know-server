import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDateString,
  IsArray,
  IsInt,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
  ArrayMinSize,
  Matches,
  IsOptional,
} from 'class-validator';
import { DayOfWeek } from '../entities/instructional-course.entity';

export class CreateInstructionalCourseDto {
  @ApiProperty({
    description: 'The name of the course',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'A detailed description of the course',
    example: 'A comprehensive introduction to computer science fundamentals...',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    description: 'The start date of the course',
    example: '2024-02-01T00:00:00Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'The finish date of the course',
    example: '2024-05-31T00:00:00Z',
  })
  @IsDateString()
  finish_date: Date;

  @ApiProperty({
    description: 'The start time of the course in UTC (24-hour format)',
    example: '14:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in 24-hour format (HH:mm)',
  })
  start_time_utc: string;

  @ApiProperty({
    description: 'The duration of each class session in minutes',
    example: 90,
    minimum: 15,
    maximum: 480,
  })
  @IsInt()
  @Min(15)
  @Max(480)
  duration_minutes: number;

  @ApiProperty({
    description: 'The days of the week when the course meets',
    example: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    enum: DayOfWeek,
    isArray: true,
  })
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @ArrayMinSize(1)
  days_of_week: DayOfWeek[];

  @ApiProperty({
    description: 'The ID of the learning institution offering the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  institution_id: string;

  @ApiProperty({
    description: 'The ID of the instructor teaching the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  instructor_id: string;

  @ApiProperty({
    description: 'The IDs of the proctors assigned to the course',
    example: ['123e4567-e89b-12d3-a456-426614174001'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  proctor_ids?: string[];
}
