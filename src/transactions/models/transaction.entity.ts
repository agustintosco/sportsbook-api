import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Bet } from './bet.entity';
import { TransactionType } from './transaction-type.enum';

@Entity('transactions')
export class Transaction {
  @ApiProperty({
    name: 'ID',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'User ID related to the transaction',
    type: Number,
    example: 1,
  })
  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @ApiProperty({
    name: 'Transaction type',
    type: TransactionType,
    example: 'Deposit',
  })
  @Column({
    type: 'enum',
    name: 'type',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({
    name: 'Transaction amount',
    type: Number,
    example: 1,
  })
  @Column({
    type: 'double',
    name: 'amount',
  })
  amount: number;

  @OneToOne(() => Bet, { eager: true })
  @JoinColumn({ name: 'transaction_id' })
  bet?: Bet;
}
