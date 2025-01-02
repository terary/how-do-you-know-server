import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('simple-array')
  tags: string[];

  @Column('text', { nullable: true })
  correctAnswer: string;

  @Column('simple-array', { nullable: true })
  options: string[];

  @Column({ default: 'text' })
  type: 'text' | 'multiple-choice' | 'true-false';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
