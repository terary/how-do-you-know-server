import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FodderPool } from './fodder-pool.entity';

@Entity('fodder_items')
export class FodderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  pool_id: string;

  @Column()
  text: string;

  @Column('uuid')
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => FodderPool, (pool) => pool.items)
  @JoinColumn({ name: 'pool_id' })
  pool: FodderPool;
}
