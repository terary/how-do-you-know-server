import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionTemplate } from './question-template.entity';
import { FodderPool } from './fodder-pool.entity';

@Entity('question_template_valid_answers')
export class QuestionTemplateValidAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  template_id: string;

  @Column({ nullable: true })
  text: string | null;

  @Column({
    name: 'boolean_value',
    nullable: true,
  })
  booleanValue: boolean | null;

  @Column({
    name: 'fodder_pool_id',
    type: 'uuid',
    nullable: true,
  })
  fodderPoolId: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => QuestionTemplate, (template) => template.validAnswers)
  @JoinColumn({ name: 'template_id' })
  template: QuestionTemplate;

  @ManyToOne(() => FodderPool)
  @JoinColumn({ name: 'fodder_pool_id' })
  fodderPool: FodderPool | null;
}
