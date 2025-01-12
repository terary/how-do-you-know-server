import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ExamTemplate } from './exam-template.entity';

@Entity('exam_template_sections')
export class ExamTemplateSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  instructions: string;

  @Column('int')
  position: number;

  @Column('int', { name: 'time_limit_seconds' })
  timeLimitSeconds: number;

  @ManyToOne(() => ExamTemplate, (template) => template.sections)
  @JoinColumn({ name: 'exam_template_id' })
  examTemplate: ExamTemplate;

  @Column('uuid')
  exam_template_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
