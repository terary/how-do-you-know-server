import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionActual } from './question-actual.entity';

@Entity('question_actual_valid_answers')
export class QuestionActualValidAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  question_actual_id: string;

  @Column({ nullable: true })
  text: string | null;

  @Column({
    name: 'boolean_value',
    nullable: true,
  })
  booleanValue: boolean | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => QuestionActual, (actual) => actual.validAnswers)
  @JoinColumn({ name: 'question_actual_id' })
  questionActual: QuestionActual;
}
