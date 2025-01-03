import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionTemplate } from './question-template.entity';

@Entity('question_template_media')
export class QuestionTemplateMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  template_id: string;

  @Column({
    type: 'text',
    name: 'media_content_type',
  })
  mediaContentType: 'audio/mpeg' | 'video/mp4';

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  url: string;

  @Column({
    name: 'special_instruction_text',
    nullable: true,
  })
  specialInstructionText: string | null;

  @Column({ nullable: true })
  duration: number | null;

  @Column({
    name: 'file_size',
    nullable: true,
  })
  fileSize: number | null;

  @Column({
    name: 'thumbnail_url',
    nullable: true,
  })
  thumbnailUrl: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => QuestionTemplate, (template) => template.media)
  @JoinColumn({ name: 'template_id' })
  template: QuestionTemplate;
}
