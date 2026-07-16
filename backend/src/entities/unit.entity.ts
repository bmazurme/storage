import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Box } from './box.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageKey: string | null;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 5 })
  minQuantity: number;

  @Column({ unique: true })
  code: string;

  @Column()
  number: number;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Box, (box) => box.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boxId' })
  box: Box;

  @Column()
  boxId: string;

  @CreateDateColumn()
  createdAt: Date;
}
