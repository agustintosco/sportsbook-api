import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Transaction } from './models/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionType } from './models/transaction-type.enum';
import { Roles } from './../auth/decorators/roles.decorator';
import { Role } from './../users/models/roles.enum';
import { EventService } from './../events/services/event.service';
import { CreateBetDTO } from './models/create-bet.dto';
import { UserService } from './../users/user.service';
import { CancelBetDTO } from './models/cancel-bet.dto';
import { Bet } from './models/bet.entity';
import { DepositOrWithdrawalDTO } from './models/create-dep-wit.dto';
import { BetStatus } from './models/bet-status.enum';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private eventService: EventService,
    private userService: UserService,
  ) {}

  @Roles(Role.ADMIN)
  @Get('all')
  async adminGetAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('type') transactionType?: TransactionType,
    @Query('user') userId?: number,
    @Query('event') eventId?: number,
    @Query('sport') sportId?: number,
  ): Promise<Pagination<Transaction>> {
    limit = limit > 100 ? 100 : limit;

    return this.transactionService.getAll(
      {
        page,
        limit,
        route: '/transactions',
      },
      userId,
      transactionType,
      eventId,
      sportId,
    );
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('type') transactionType: TransactionType,
  ): Promise<Pagination<Transaction>> {
    const id = req.user.id;

    limit = limit > 100 ? 100 : limit;

    return this.transactionService.getAll(
      {
        page,
        limit,
        route: '/transactions',
      },
      id,
      transactionType,
    );
  }

  @Get('balance')
  @HttpCode(200)
  async getBalance(@Req() req) {
    const balance: number = await this.transactionService.calculateBalance(
      req.user.id,
    );
    this.userService.setBalance(req.user.id, balance);

    return { balance: balance };
  }

  @Roles(Role.ADMIN)
  @Get('balance/:id')
  async getBalanceByUser(@Param('id') id: number) {
    const balance: number = await this.transactionService.calculateBalance(id);

    return { balance: balance };
  }

  @Post('deposit')
  @HttpCode(201)
  async makeDeposit(@Req() req, @Body() depositDTO: DepositOrWithdrawalDTO) {
    await this.transactionService.create(
      req.user.id,
      TransactionType.DEPOSIT,
      depositDTO.amount,
    );

    const balance: number = await this.transactionService.calculateBalance(
      req.user.id,
    );
    this.userService.setBalance(req.user.id, balance);
  }

  @Post('withdrawal')
  @HttpCode(201)
  async makeWithdrawal(
    @Req() req,
    @Body() withdrawalDTO: DepositOrWithdrawalDTO,
  ) {
    const hasEnoughCredit = await this.transactionService.hasEnoughCredit(
      req.user.id,
      withdrawalDTO.amount,
    );

    if (hasEnoughCredit) {
      await this.transactionService.create(
        req.user.id,
        TransactionType.WITHDRAW,
        withdrawalDTO.amount,
      );

      const balance: number = await this.transactionService.calculateBalance(
        req.user.id,
      );
      this.userService.setBalance(req.user.id, balance);
    } else {
      throw new HttpException(
        'The amount of the withdrawal exceeds your current balance',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Get('bets')
  @HttpCode(200)
  async getAllBetsByUser(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Bet>> {
    const id = req.user.id;

    limit = limit > 100 ? 100 : limit;

    return this.transactionService.getAllBetsByUser(
      {
        page,
        limit,
        route: '/transactions/bets',
      },
      id,
    );
  }

  @Post('bets')
  @HttpCode(201)
  async placeBet(
    @Req() req,
    @Body() createBetDTO: CreateBetDTO,
  ): Promise<void> {
    const user = req.user;

    /**
     * Check if event has not started for the user to place a bet
     */

    const event = await this.eventService.get(createBetDTO.eventId);

    if (event.hasStarted()) {
      throw new HttpException(
        'You cannot place a bet, the event has already started',
        HttpStatus.CONFLICT,
      );
    }

    /**
     * Check if user has enough credit to place the bet
     */

    if (
      !(await this.transactionService.hasEnoughCredit(
        user.id,
        createBetDTO.amount,
      ))
    ) {
      throw new HttpException(
        'Insufficient founds to place the bet',
        HttpStatus.CONFLICT,
      );
    }

    /**
     * Actually place the bet if everything is OK
     */

    await this.transactionService.placeBet(
      user.id,
      createBetDTO.amount,
      createBetDTO.betOption,
    );

    const balance: number = await this.transactionService.calculateBalance(
      user.id,
    );
    this.userService.setBalance(user.id, balance);
  }

  @Patch('bets/cancel')
  async cancelBet(@Req() req, @Body() cancelBetDTO: CancelBetDTO) {
    const user = req.user;

    let bet: Bet = await this.transactionService.getBetById(
      Number(cancelBetDTO.bet),
    );

    /**
     * Check if the bet is not already set for the user to cancel the bet
     */

    if (bet.status == BetStatus.SETTLED) {
      throw new HttpException(
        'You cannot cancel the bet, the bet is already set',
        HttpStatus.CONFLICT,
      );
    }

    /**
     *  Check if the bet is already canceled
     */

    if (bet.status == BetStatus.CANCELLED) {
      throw new HttpException(
        'The bet is already canceled',
        HttpStatus.CONFLICT,
      );
    }

    /**
     * Actually cancel the bet if everything is OK
     */

    if (bet) {
      const amountToReimburse = bet.getAmount();

      await this.transactionService.create(
        user.id,
        TransactionType.REIMBURSEMENT,
        amountToReimburse,
      );

      await this.transactionService.updateBetStatus(
        bet.id,
        BetStatus.CANCELLED,
      );

      const balance = await this.transactionService.calculateBalance(user.id);

      await this.userService.setBalance(user.id, balance);
    }
  }
}
