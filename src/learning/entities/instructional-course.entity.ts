import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LearningInstitution } from './learning-institution.entity';
import { User } from '../../users/entities/user.entity';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Entity('instructional_courses')
export class InstructionalCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('timestamp with time zone')
  finish_date: Date;

  @Column('time')
  start_time_utc: string;

  @Column('int')
  duration_minutes: number;

  @Column('enum', { enum: DayOfWeek, array: true })
  days_of_week: DayOfWeek[];

  @ManyToOne(() => LearningInstitution, (institution) => institution.courses)
  @JoinColumn({ name: 'institution_id' })
  institution: LearningInstitution;

  @Column('uuid')
  institution_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @Column('uuid')
  instructor_id: string;

  @Column('uuid', { array: true, default: '{}' })
  proctor_ids: string[];

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('text', { default: '' })
  user_defined_tags: string;
}
