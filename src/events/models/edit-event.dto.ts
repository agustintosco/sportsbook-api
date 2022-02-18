import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditEventDTO {
  @ApiPropertyOptional()
  @ApiProperty({
    name: 'sport',
    description: 'Sport ID related to the event',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sport: number;

  @ApiPropertyOptional()
  @ApiProperty({
    name: 'name',
    description: 'Name of the event',
    type: String,
    example: 'Basketball',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @ApiProperty({
    name: 'started',
    description: 'Indicates if the event has already started',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  started: boolean;
}
