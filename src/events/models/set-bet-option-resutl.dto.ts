import { IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BetResult } from './bet-option-result.enum';

export class SetBetOptionResultDTO {
  @ApiProperty({
    name: 'id',
    description: 'ID of the Bet Option which its result will be set',
    type: Number,
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    name: 'result',
    description: 'Result to assign to the Bet Option',
    type: BetResult,
    enum: BetResult,
    example: 'won',
  })
  @IsIn([BetResult.WON, BetResult.LOST])
  result: BetResult;
}
