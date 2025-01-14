import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionActual } from './question-actual.entity';

@Entity('question_actual_choices')
export class QuestionActualChoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  question_actual_id: string;

  @Column()
  text: string;

  @Column({
    name: 'is_correct',
  })
  isCorrect: boolean;

  @Column()
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => QuestionActual, (actual) => actual.choices)
  @JoinColumn({ name: 'question_actual_id' })
  questionActual: QuestionActual;
}
