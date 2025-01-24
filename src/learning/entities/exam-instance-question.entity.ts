import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamInstanceSection } from './exam-instance-section.entity';
import { ExamTemplateSectionQuestion } from './exam-template-section-question.entity';

export enum QuestionStatus {
  UNANSWERED = 'unanswered',
  ANSWERED = 'answered',
  FLAGGED = 'flagged', // Student marked for review
  SKIPPED = 'skipped', // Student explicitly skipped
}

@Entity('exam_instance_questions')
export class ExamInstanceQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  section_id: string;

  @Column('uuid')
  template_question_id: string;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.UNANSWERED,
  })
  status: QuestionStatus;

  @Column('int')
  position: number;

  @Column('jsonb', { nullable: true })
  student_answer: any; // Store the student's answer in a flexible format

  @Column('boolean', { default: false })
  is_correct: boolean;

  @Column('float', { nullable: true })
  score: number; // Partial credit possible

  @Column('text', { nullable: true })
  feedback: string; // Automated or instructor feedback

  @Column('timestamp', { nullable: true })
  answered_at: Date;

  @Column('text', { default: '' })
  user_defined_tags: string;

  @Column('jsonb', { nullable: true })
  user_notes: {
    note: string;
    created_at: Date;
  }[];

  @ManyToOne(() => ExamInstanceSection)
  @JoinColumn({ name: 'section_id' })
  section: ExamInstanceSection;

  @ManyToOne(() => ExamTemplateSectionQuestion)
  @JoinColumn({ name: 'template_question_id' })
  templateQuestion: ExamTemplateSectionQuestion;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
