import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BetOption } from './bet-option.entity';
import { Sport } from './sport.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sport, { eager: true })
  @JoinColumn({ name: 'sport_id' })
  sport: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'started',
    type: 'boolean',
    default: false,
  })
  started: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => BetOption, (betOption) => betOption.event, { eager: true })
  betOptions: BetOption[];

  hasStarted(): boolean {
    return this.started ? true : false;
  }
}
