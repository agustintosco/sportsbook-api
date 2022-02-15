import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bet } from './bet.entity';
import { TransactionType } from './transaction-type.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @Column({
    type: 'enum',
    name: 'type',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'double',
    name: 'amount',
  })
  amount: number;

  @OneToOne(() => Bet, { eager: true })
  @JoinColumn({ name: 'transaction_id' })
  bet?: Bet;
}
