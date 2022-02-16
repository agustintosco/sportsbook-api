import { IsNumber } from 'class-validator';
import { Bet } from './bet.entity';

export class CancelBetDTO {
  @IsNumber()
  eventId: number;

  @IsNumber()
  bet: Bet;
}
