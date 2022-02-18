import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './models/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Bet } from './models/bet.entity';
import { EventService } from './../events/services/event.service';
import { Event } from './../events/models/event.entity';
import { Sport } from './../events/models/sport.entity';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/models/user.entity';
import { BetOption } from 'src/events/models/bet-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Bet, Event, Sport, User, BetOption]),
  ],
  providers: [TransactionService, EventService, UserService],
  controllers: [TransactionController],
})
export class TransactionModule {}
