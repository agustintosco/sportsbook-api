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
import {
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
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

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private eventService: EventService,
    private userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Get all transactions',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
        links: {
          first: '/transactions?limit=10',
          previous: '',
          next: '',
          last: '',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'Requiered page. Default value: 1',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'Number of items per page. Default value: 10',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    type: 'number',
    description: 'Type of transaction',
    required: false,
    enum: TransactionType,
    example: 'deposit',
  })
  @ApiQuery({
    name: 'user',
    type: 'number',
    description: 'User ID',
    required: false,
    example: 1,
  })
  @Roles(Role.ADMIN)
  @Get('all')
  async adminGetAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('type') transactionType?: TransactionType,
    @Query('user') userId?: number,
  ): Promise<Pagination<Transaction>> {
    limit = limit > 100 ? 100 : limit;

    return this.transactionService.getAll(
      {
        page,
        limit,
        route: '/transactions/all',
      },
      userId,
      transactionType,
    );
  }

  @ApiOperation({
    summary: 'Get logged User transactions',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        userId: 1,
        type: TransactionType,
        amount: 100,
      },
    },
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'Requiered page. Default value: 1',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'Number of items per page. Default value: 10',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    type: 'number',
    description: 'Type of transaction',
    required: false,
    enum: TransactionType,
    example: 'deposit',
  })
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

  @ApiOperation({
    summary: 'Request logged User balance',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        balance: 1000,
      },
    },
  })
  @Get('balance')
  @HttpCode(200)
  async getBalance(@Req() req) {
    const balance: number = await this.transactionService.calculateBalance(
      req.user.id,
    );
    this.userService.setBalance(req.user.id, balance);

    return { balance: balance };
  }

  @ApiOperation({
    summary: 'Request balance of a giver User',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        balance: 1000,
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  @Roles(Role.ADMIN)
  @Get('balance/:id')
  async getBalanceByUser(@Param('id') id: number) {
    const balance: number = await this.transactionService.calculateBalance(id);

    return { balance: balance };
  }

  @ApiOperation({
    summary: 'Make a Deposit',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The deposit has been successfully processed.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
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

  @ApiOperation({
    summary: 'Make a Withdrawal',
  })
  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The withdrawal has been successfully processed.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
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

  @ApiOperation({
    summary: 'Get logged User Bets',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
        links: {
          first: '/bets?limit=10',
          previous: '',
          next: '',
          last: '',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
  })
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

  @ApiOperation({
    summary: 'Place a Bet',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The bet has been successfully processed.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
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

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }

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

  @ApiOperation({
    summary: 'Cancel a Bet',
  })
  @ApiBearerAuth()
  @Patch('bets/cancel')
  async cancelBet(@Req() req, @Body() cancelBetDTO: CancelBetDTO) {
    const user = req.user;

    const bet: Bet = await this.transactionService.getBetById(
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
      const amountToReimburse = bet.amount;

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
