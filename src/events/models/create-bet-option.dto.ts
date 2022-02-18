import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetOptionDTO {
  @ApiProperty({
    name: 'name',
    description: 'Name of the Bet Option',
    type: String,
    examples: ['Palmeiras', 'Draw', 'Corinthians'],
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'odd',
    description: 'Odd assigned to the bet option',
    type: Number,
    example: 1.5,
  })
  @IsNumber()
  odd: number;

  @ApiProperty({
    name: 'event',
    description: 'Event ID related to the Bet Option',
    type: Number,
    example: 1,
  })
  @IsNumber()
  event: number;
}
