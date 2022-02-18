import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDTO {
  @ApiProperty({
    name: 'name',
    description: 'Name of the event',
    type: String,
    example: 'Palmeiras vs Corinthians',
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'sport',
    description: 'Sport ID related to the event',
    type: Number,
    example: 1,
  })
  @IsNumber()
  sport: number;
}
