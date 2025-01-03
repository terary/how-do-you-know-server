import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FodderItem } from './fodder-item.entity';

@Entity('fodder_pools')
export class FodderPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => FodderItem, (item) => item.pool)
  items: FodderItem[];
}
