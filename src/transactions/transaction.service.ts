import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './models/transaction-type.enum';
import { Transaction } from './models/transaction.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Bet } from './models/bet.entity';
import { BetStatus } from './models/bet-status.enum';
import { BetOption } from './../events/models/bet-option.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Bet)
    private betRepository: Repository<Bet>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    userId?: number,
    type?: TransactionType,
    eventId?: number,
    sportId?: number,
  ): Promise<Pagination<Transaction>> {
    let transactions =
      this.transactionsRepository.createQueryBuilder('transactions');

    if (userId) {
      transactions.where('user_id = :userId', { userId });
    }

    if (eventId) {
      transactions.where('event = :eventId', { eventId });
    }

    if (type) {
      transactions.andWhere(`transactions.type = :type`, { type: type });
    }

    return paginate<Transaction>(transactions, options);
  }

  async getAllBetsByUser(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Bet>> {
    let bets = this.betRepository
      .createQueryBuilder('bets')
      .where('user_id = :userId', { userId });

    return paginate<Bet>(bets, options);
  }

  async getAllByUser(userId: number) {
    return this.transactionsRepository.find({ userId: userId });
  }

  async calculateBalance(userId: number) {
    let transactions = await this.getAllByUser(userId);

    let balance: number = 0;

    for (let i = 0; i < transactions.length; i++) {
      if (
        transactions[i].type == TransactionType.DEPOSIT ||
        transactions[i].type == TransactionType.WINNING ||
        transactions[i].type == TransactionType.REIMBURSEMENT
      ) {
        balance += Number(transactions[i].amount);
      }
      if (
        transactions[i].type == TransactionType.BET ||
        transactions[i].type == TransactionType.WITHDRAW
      ) {
        balance -= Number(transactions[i].amount);
      }
    }

    return balance;
  }

  async create(
    userId: number,
    type: TransactionType,
    amount: number,
  ): Promise<Transaction> {
    let transaction: Transaction = await this.transactionsRepository.create({
      userId: userId,
      type: type,
      amount: amount,
    });

    return await this.transactionsRepository.save(transaction);
  }

  async placeBet(
    userId: number,
    amount: number,
    betOption: BetOption,
  ): Promise<void> {
    const transaction: Transaction = await this.create(
      userId,
      TransactionType.BET,
      amount,
    );

    let bet: Bet = await this.betRepository.create({
      userId: userId,
      amount: amount,
      status: BetStatus.ACTIVE,
      betOption: betOption,
      transaction: transaction,
    });

    await this.betRepository.save(bet);
  }

  async getBetById(id: number): Promise<Bet> {
    return await this.betRepository.findOne(id);
  }

  async updateBetStatus(id: number, status: BetStatus) {
    const bet: Bet = await this.betRepository.findOne(id);

    this.betRepository.merge(bet, { status });

    this.betRepository.save(bet);
  }

  /**
   *  Used for checking if user has enough credit when making a bet or a withdrawal
   */

  async hasEnoughCredit(userId: number, amount: number): Promise<boolean> {
    const balance: number = await this.calculateBalance(userId);

    return balance - amount >= 0 ? true : false;
  }
}