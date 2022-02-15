import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bet } from './../../transactions/models/bet.entity';
import { BetResult } from './bet-option-result.enum';
import { Event } from './event.entity';

@Entity('bet_options')
export class BetOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'odd',
    type: 'double',
  })
  odd: number;

  @Column({
    name: 'result',
    type: 'enum',
    enum: BetResult,
    nullable: true,
  })
  result: BetResult;

  @ManyToOne(() => Event, (event) => event.betOptions)
  @JoinColumn({ name: 'event_id' })
  event: number;

  @OneToMany(() => Bet, (bet) => bet.betOption)
  bets?: Bet[];
}
