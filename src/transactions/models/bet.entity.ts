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
import { BetOption } from '../../events/models/bet-option.entity';
import { BetStatus } from './bet-status.enum';
import { Transaction } from './transaction.entity';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @Column({
    name: 'amount',
    type: 'double',
  })
  amount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BetStatus,
  })
  status: BetStatus;

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

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => BetOption, (betOption) => betOption.bets)
  @JoinColumn({ name: 'bet_option_id' })
  betOption: BetOption;

  public getAmount(): number {
    return this.amount;
  }
}
