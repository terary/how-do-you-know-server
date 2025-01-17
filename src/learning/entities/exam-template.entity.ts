import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamTemplateSection } from './exam-template-section.entity';

export enum ExamExclusivityType {
  EXAM_ONLY = 'exam-only',
  PRACTICE_ONLY = 'practice-only',
  EXAM_PRACTICE_BOTH = 'exam-practice-both',
}

@Entity('exam_templates')
export class ExamTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('uuid')
  course_id: string;

  @Column('uuid')
  created_by: string;

  @Column('timestamp')
  availability_start_date: Date;

  @Column('timestamp')
  availability_end_date: Date;

  @Column('int', { default: 1 })
  version: number;

  @Column('uuid', { nullable: true })
  parent_template_id: string;

  @Column('boolean', { default: false })
  is_published: boolean;

  @Column({
    type: 'enum',
    enum: ExamExclusivityType,
    default: ExamExclusivityType.EXAM_PRACTICE_BOTH,
  })
  examExclusivityType: ExamExclusivityType;

  @ManyToOne(() => ExamTemplate, { nullable: true })
  @JoinColumn({ name: 'parent_template_id' })
  parentTemplate: ExamTemplate;

  @OneToMany(() => ExamTemplate, (template) => template.parentTemplate)
  childTemplates: ExamTemplate[];

  @OneToMany(() => ExamTemplateSection, (section) => section.examTemplate)
  sections: ExamTemplateSection[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
