import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InstructionalCourse } from './instructional-course.entity';

@Entity('learning_institutions')
export class LearningInstitution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => InstructionalCourse, (course) => course.institution)
  courses: InstructionalCourse[];
}
