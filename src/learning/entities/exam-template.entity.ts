import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { InstructionalCourse } from './instructional-course.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

export type ExamExclusivityType =
  | 'exam-only'
  | 'practice-only'
  | 'exam-practice-both';

@Entity('exam_templates')
export class ExamTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'text',
    name: 'exam_exclusivity_type',
  })
  examExclusivityType: ExamExclusivityType;

  @Column('timestamp with time zone')
  availability_start_date: Date;

  @Column('timestamp with time zone')
  availability_end_date: Date;

  @ManyToOne(() => InstructionalCourse)
  @JoinColumn({ name: 'course_id' })
  course: InstructionalCourse;

  @Column('uuid')
  course_id: string;

  @ManyToMany(() => QuestionTemplate)
  @JoinTable({
    name: 'exam_template_questions',
    joinColumn: {
      name: 'exam_template_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'question_template_id',
      referencedColumnName: 'id',
    },
  })
  questions: QuestionTemplate[];

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
