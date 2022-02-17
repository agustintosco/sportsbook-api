import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { OnEvent } from '@nestjs/event-emitter';

import { TransactionType } from './models/transaction-type.enum';
import { Transaction } from './models/transaction.entity';
import { Bet } from './models/bet.entity';
import { BetStatus } from './models/bet-status.enum';
import { BetOption } from './../events/models/bet-option.entity';
import { BetResult } from 'src/events/models/bet-option-result.enum';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TransactionService {
  constructor(
    private userService: UserService,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Bet)
    private betRepository: Repository<Bet>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    userId?: number,
    type?: TransactionType,
  ): Promise<Pagination<Transaction>> {
    const transactions =
      this.transactionsRepository.createQueryBuilder('transactions');

    if (type) {
      transactions.andWhere(`transactions.type = :type`, { type: type });
    }

    return paginate<Transaction>(transactions, options);
  }

  async getAllBetsByUser(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Bet>> {
    const bets = this.betRepository
      .createQueryBuilder('bets')
      .where('user_id = :userId', { userId });

    return paginate<Bet>(bets, options);
  }

  async getAllByUser(userId: number) {
    return this.transactionsRepository.find({ userId: userId });
  }

  async calculateBalance(userId: number) {
    const transactions = await this.getAllByUser(userId);

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
    const transaction: Transaction = await this.transactionsRepository.create({
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

    const bet: Bet = await this.betRepository.create({
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

  /**
   *    EVENTS
   */

  @OnEvent('bet-option.result-set')
  async handleBetOptionResult(betOption: BetOption): Promise<void> {
    const bets = await this.betRepository.createQueryBuilder();
    bets.where({ betOption: betOption.id });
    const allBets: Bet[] = await bets.getMany();

    /**
     *  Filter to get only ACTIVE bets
     */

    const betsToUpdate = allBets.filter(
      (bet) => bet.status == BetStatus.ACTIVE,
    );

    /**
     *
     */

    for (let i = 0; i < betsToUpdate.length; i++) {
      betsToUpdate[i].setStatus(BetStatus.SETTLED);
    }

    if (betOption.result == BetResult.WON) {
      const odd = betOption.odd;

      for (let i = 0; i < betsToUpdate.length; i++) {
        const userId = betsToUpdate[i].userId;
        const amountToPay = betsToUpdate[i].amount * odd;

        await this.create(userId, TransactionType.WINNING, amountToPay);

        /**
         * Calculate and update user balance
         */

        const balance: number = await this.calculateBalance(userId);

        await this.userService.setBalance(userId, balance);
      }
    }
  }
}
