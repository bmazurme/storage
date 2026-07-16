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
import { Unit } from './unit.entity';

@Entity('boxes')
export class Box {
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

  @ManyToOne(() => Container, (container) => container.boxes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'containerId' })
  container: Container;

  @Column()
  containerId: string;

  @OneToMany(() => Unit, (unit) => unit.box)
  units: Unit[];

  @CreateDateColumn()
  createdAt: Date;
}
