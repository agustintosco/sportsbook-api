import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetDTO {
  @ApiProperty({
    name: 'eventId',
    description: 'Event ID related to the Bet',
    type: Number,
    example: 1,
  })
  @IsNumber()
  eventId: number;

  @ApiProperty({
    name: 'amount',
    description: 'Bet amount',
    type: Number,
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    name: 'betOption',
    description: 'Bet Option ID on which the Bet will be set',
    type: Number,
    example: 1,
  })
  @IsNumber()
  betOption: number;
}
