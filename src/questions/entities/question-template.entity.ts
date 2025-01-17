import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplateValidAnswer } from './question-template-valid-answer.entity';
import { QuestionActual } from './question-actual.entity';
import { TUserPromptType, TUserResponseType } from '../types';

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('question_templates')
export class QuestionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    name: 'user_prompt_type',
  })
  userPromptType: TUserPromptType;

  @Column({
    type: 'text',
    name: 'user_response_type',
  })
  userResponseType: TUserResponseType;

  @Column({
    type: 'text',
    name: 'exclusivity_type',
  })
  exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';

  @Column({
    type: 'text',
    name: 'user_prompt_text',
    nullable: true,
  })
  userPromptText: string | null;

  @Column({
    type: 'text',
    name: 'instruction_text',
    nullable: true,
  })
  instructionText: string | null;

  @Column({
    type: 'text',
    name: 'difficulty',
    enum: QuestionDifficulty,
    default: QuestionDifficulty.MEDIUM,
  })
  difficulty: QuestionDifficulty;

  @Column('simple-array', { name: 'topics', nullable: true })
  topics: string[] | null;

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => QuestionTemplateMedia, (media) => media.template)
  media: QuestionTemplateMedia[];

  @OneToMany(() => QuestionTemplateValidAnswer, (answer) => answer.template)
  validAnswers: QuestionTemplateValidAnswer[];

  @OneToMany(() => QuestionActual, (actual) => actual.template)
  actuals: QuestionActual[];
}
