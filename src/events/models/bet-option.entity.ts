import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Bet } from './../../transactions/models/bet.entity';
import { BetResult } from './bet-option-result.enum';
import { Event } from './event.entity';

@Entity('bet_options')
export class BetOption {
  @ApiProperty({
    name: 'id',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'name',
    description: 'Name of the Bet Option',
    type: String,
    example: 'Boca Juniors',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    name: 'odd',
    description: 'Odd assigned to the bet option',
    type: Number,
    example: '1.5',
  })
  @Column({
    name: 'odd',
    type: 'double',
  })
  odd: number;

  @ApiProperty({
    name: 'result',
    description: 'The result assigned to the bet option',
    type: String,
    enum: BetResult,
    example: '1',
  })
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
