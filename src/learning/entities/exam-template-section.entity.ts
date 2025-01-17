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
import { ExamTemplateSectionQuestion } from './exam-template-section-question.entity';

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

  @Column('jsonb', { name: 'difficulty_distribution', nullable: true })
  difficultyDistribution: {
    difficulty: string;
    percentage: number;
  }[];

  @Column('jsonb', { name: 'topic_distribution', nullable: true })
  topicDistribution: {
    topics: string[];
    percentage: number;
  }[];

  @ManyToOne(() => ExamTemplate, (template) => template.sections)
  @JoinColumn({ name: 'exam_template_id' })
  examTemplate: ExamTemplate;

  @Column('uuid')
  exam_template_id: string;

  @OneToMany(() => ExamTemplateSectionQuestion, (question) => question.section)
  questions: ExamTemplateSectionQuestion[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
