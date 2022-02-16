import { IsNumber, IsPositive } from 'class-validator';
import { BetOption } from './../../events/models/bet-option.entity';

export class CreateBetDTO {
  @IsNumber()
  eventId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  betOption: BetOption;
}
