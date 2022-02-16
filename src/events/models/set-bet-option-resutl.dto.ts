import { IsIn, IsNumber } from 'class-validator';
import { BetResult } from './bet-option-result.enum';

export class SetBetOptionResultDTO {
  @IsNumber()
  id: number;

  @IsIn([BetResult.WON, BetResult.LOST])
  result: BetResult;
}
