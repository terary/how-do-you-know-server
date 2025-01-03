import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QuestionTemplate } from './question-template.entity';
import { QuestionActualChoice } from './question-actual-choice.entity';
import { QuestionActualValidAnswer } from './question-actual-valid-answer.entity';

@Entity('question_actuals')
export class QuestionActual {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  template_id: string;

  @Column({
    type: 'text',
    name: 'exam_type',
  })
  examType: 'practice' | 'live';

  @Column({
    name: 'section_position',
  })
  sectionPosition: number;

  @Column({
    name: 'user_prompt_text',
    nullable: true,
  })
  userPromptText: string | null;

  @Column({
    name: 'instruction_text',
    nullable: true,
  })
  instructionText: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => QuestionTemplate, (template) => template.actuals)
  @JoinColumn({ name: 'template_id' })
  template: QuestionTemplate;

  @OneToMany(() => QuestionActualChoice, (choice) => choice.questionActual)
  choices: QuestionActualChoice[];

  @OneToMany(() => QuestionActualValidAnswer, (answer) => answer.questionActual)
  validAnswers: QuestionActualValidAnswer[];
}
