import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Bet } from './bet.entity';

export class CancelBetDTO {
  @ApiProperty({
    name: 'eventId',
    description: 'Event ID related to the Bet',
    type: Number,
    example: 1,
  })
  @IsNumber()
  eventId: number;

  @ApiProperty({
    name: 'bet',
    description: 'Bet ID to be canceled',
    type: Number,
    example: 1,
  })
  @IsNumber()
  bet: Bet;
}
