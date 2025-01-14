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
import { InstructionalCourse } from './instructional-course.entity';
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

  @OneToMany(() => ExamTemplateSection, (section) => section.examTemplate)
  sections: ExamTemplateSection[];

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
