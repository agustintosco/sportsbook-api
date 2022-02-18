import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { Bet } from './bet.entity';
import { TransactionType } from './transaction-type.enum';
import { Exclude } from 'class-transformer';

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
    default: null,
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @OneToOne(() => Bet, { eager: true })
  @JoinColumn({ name: 'transaction_id' })
  bet?: Bet;
}
