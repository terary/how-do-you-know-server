import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ExamTemplate } from './exam-template.entity';

export enum ExamInstanceType {
  EXAM = 'exam',
  PRACTICE_EXAM = 'practice-exam',
  STUDY_GUIDE = 'study-guide',
}

export enum ExamInstanceStatus {
  SCHEDULED = 'scheduled', // Not yet started
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired', // Past end date without completion
}

@Entity('exam_instances')
export class ExamInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ExamInstanceType,
  })
  type: ExamInstanceType;

  @Column({
    type: 'enum',
    enum: ExamInstanceStatus,
    default: ExamInstanceStatus.SCHEDULED,
  })
  status: ExamInstanceStatus;

  @Column('uuid')
  template_id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  course_id: string;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date;

  @Column('timestamp', { nullable: true })
  started_at: Date;

  @Column('timestamp', { nullable: true })
  completed_at: Date;

  @Column('jsonb', { nullable: true })
  user_notes: {
    section_id: string;
    note: string;
    created_at: Date;
  }[];

  @Column('text', { default: '' })
  user_defined_tags: string;

  @ManyToOne(() => ExamTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ExamTemplate;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
