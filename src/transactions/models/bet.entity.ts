import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { BetOption } from '../../events/models/bet-option.entity';
import { BetStatus } from './bet-status.enum';
import { Transaction } from './transaction.entity';

@Entity('bets')
export class Bet {
  @ApiProperty({
    name: 'ID',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'User ID related to the bet',
    type: Number,
    example: 1,
  })
  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @ApiProperty({
    name: 'Bet amount',
    type: Number,
    example: 1,
  })
  @Column({
    name: 'amount',
    type: 'double',
  })
  amount: number;

  @ApiProperty({
    name: 'Bet status',
    type: BetStatus,
    example: 'ACTIVE',
  })
  @Column({
    name: 'status',
    type: 'enum',
    enum: BetStatus,
    default: BetStatus.ACTIVE,
  })
  status: BetStatus;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    select: false,
    default: null,
  })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => BetOption, (betOption) => betOption.bets)
  @JoinColumn({ name: 'bet_option_id' })
  betOption: BetOption;

  setStatus(status: BetStatus): void {
    this.status = status;
  }
}
