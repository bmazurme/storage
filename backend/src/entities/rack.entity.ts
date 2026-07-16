import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shelf } from './shelf.entity';

@Entity('racks')
export class Rack {
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

  @OneToMany(() => Shelf, (shelf) => shelf.rack)
  shelves: Shelf[];

  @CreateDateColumn()
  createdAt: Date;
}
