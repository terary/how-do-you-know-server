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
import { ExamInstance } from './exam-instance.entity';
import { ExamTemplateSection } from './exam-template-section.entity';

export enum SectionStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  TIMED_OUT = 'timed-out',
}

@Entity('exam_instance_sections')
export class ExamInstanceSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exam_instance_id: string;

  @Column('uuid')
  template_section_id: string;

  @Column({
    type: 'enum',
    enum: SectionStatus,
    default: SectionStatus.NOT_STARTED,
  })
  status: SectionStatus;

  @Column('int')
  position: number;

  @Column('timestamp', { nullable: true })
  started_at: Date;

  @Column('timestamp', { nullable: true })
  completed_at: Date;

  @Column('int')
  time_limit_seconds: number;

  @Column('int', { default: 0 })
  time_spent_seconds: number;

  @Column('text', { default: '' })
  user_defined_tags: string;

  @ManyToOne(() => ExamInstance)
  @JoinColumn({ name: 'exam_instance_id' })
  examInstance: ExamInstance;

  @ManyToOne(() => ExamTemplateSection)
  @JoinColumn({ name: 'template_section_id' })
  templateSection: ExamTemplateSection;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
