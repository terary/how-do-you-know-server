import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/instructional-course.entity';
import { LearningInstitutionDto } from './learning-institution.dto';
import { UserDto } from '../../users/dto/user.dto';

export class InstructionalCourseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  finish_date: Date;

  @ApiProperty()
  start_time_utc: string;

  @ApiProperty()
  duration_minutes: number;

  @ApiProperty({ enum: DayOfWeek, isArray: true })
  days_of_week: DayOfWeek[];

  @ApiProperty()
  institution_id: string;

  @ApiProperty()
  instructor_id: string;

  @ApiProperty({ type: [String] })
  proctor_ids: string[];

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: () => LearningInstitutionDto })
  institution?: LearningInstitutionDto;

  @ApiProperty({ type: () => UserDto })
  instructor?: UserDto;
}
