import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Box } from './box.entity';
import { Shelf } from './shelf.entity';

@Entity('containers')
export class Container {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column()
  number: number;

  @Column({ default: 0 })
  capacity: number;

  @ManyToOne(() => Shelf, (shelf) => shelf.containers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shelfId' })
  shelf: Shelf;

  @Column()
  shelfId: string;

  @OneToMany(() => Box, (box) => box.container)
  boxes: Box[];

  @CreateDateColumn()
  createdAt: Date;
}
