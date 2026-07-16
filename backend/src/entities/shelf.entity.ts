import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Container } from './container.entity';
import { Rack } from './rack.entity';

@Entity('shelves')
export class Shelf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  number: number;

  @Column({ default: 0 })
  capacity: number;

  @ManyToOne(() => Rack, (rack) => rack.shelves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rackId' })
  rack: Rack;

  @Column()
  rackId: string;

  @OneToMany(() => Container, (container) => container.shelf)
  containers: Container[];

  @CreateDateColumn()
  createdAt: Date;
}
