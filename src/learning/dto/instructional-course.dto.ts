import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/instructional-course.entity';
import { LearningInstitutionDto } from './learning-institution.dto';
import { User } from '../../users/entities/user.entity';

export class InstructionalCourseDto {
  @ApiProperty({
    description: 'The unique identifier of the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the course',
    example: 'Introduction to Computer Science',
  })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the course',
    example: 'A comprehensive introduction to computer science fundamentals...',
  })
  description: string;

  @ApiProperty({
    description: 'The start date of the course',
    example: '2024-02-01T00:00:00Z',
  })
  start_date: Date;

  @ApiProperty({
    description: 'The finish date of the course',
    example: '2024-05-31T00:00:00Z',
  })
  finish_date: Date;

  @ApiProperty({
    description: 'The start time of the course in UTC (24-hour format)',
    example: '14:00',
  })
  start_time_utc: string;

  @ApiProperty({
    description: 'The duration of each class session in minutes',
    example: 90,
  })
  duration_minutes: number;

  @ApiProperty({
    description: 'The days of the week when the course meets',
    example: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    enum: DayOfWeek,
    isArray: true,
  })
  days_of_week: DayOfWeek[];

  @ApiProperty({
    description: 'The ID of the learning institution offering the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  institution_id: string;

  @ApiProperty({
    description: 'The learning institution offering the course',
    type: () => LearningInstitutionDto,
  })
  institution: LearningInstitutionDto;

  @ApiProperty({
    description: 'The ID of the instructor teaching the course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  instructor_id: string;

  @ApiProperty({
    description: 'The instructor teaching the course',
    type: () => User,
  })
  instructor: User;

  @ApiProperty({
    description: 'The IDs of the proctors assigned to the course',
    example: ['123e4567-e89b-12d3-a456-426614174001'],
  })
  proctor_ids: string[];

  @ApiProperty({
    description: 'The ID of the user who created this course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_by: string;

  @ApiProperty({
    description: 'The timestamp when this course was created',
    example: '2024-01-20T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when this course was last updated',
    example: '2024-01-20T12:00:00Z',
  })
  updated_at: Date;
}
