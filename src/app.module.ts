import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/event.module';
import { BetOption } from './events/models/bet-option.entity';
import { Sport } from './events/models/sport.entity';
import { Bet } from './transactions/models/bet.entity';
import { Transaction } from './transactions/models/transaction.entity';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Bet, BetOption, Event, Sport],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
