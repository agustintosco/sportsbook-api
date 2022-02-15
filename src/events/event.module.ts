import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './models/event.entity';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { Sport } from './models/sport.entity';
import { BetOption } from './models/bet-option.entity';
import { BetOptionController } from './controllers/bet-option.controller';
import { BetOptionService } from './services/bet-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Sport, BetOption])],
  providers: [EventService, BetOptionService],
  controllers: [EventController, BetOptionController],
  exports: [EventService],
})
export class EventsModule {}
