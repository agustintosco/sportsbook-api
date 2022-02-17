import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/event.module';
import { Event } from './events/models/event.entity';
import { BetOption } from './events/models/bet-option.entity';
import { Sport } from './events/models/sport.entity';
import { Bet } from './transactions/models/bet.entity';
import { Transaction } from './transactions/models/transaction.entity';
import { TransactionModule } from './transactions/transaction.module';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Bet, BetOption, Event, Sport],
      synchronize: true,
      autoLoadEntities: true,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    EventsModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
