import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamTemplateSection } from './exam-template-section.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

@Entity('exam_template_section_questions')
export class ExamTemplateSectionQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  section_id: string;

  @Column('uuid')
  question_template_id: string;

  @Column('int', { default: 0 })
  position: number;

  @ManyToOne(() => ExamTemplateSection)
  @JoinColumn({ name: 'section_id' })
  section: ExamTemplateSection;

  @ManyToOne(() => QuestionTemplate)
  @JoinColumn({ name: 'question_template_id' })
  questionTemplate: QuestionTemplate;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
