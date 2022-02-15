import { IsNumber, IsString } from 'class-validator';

export class CreateEventDTO {
  @IsString()
  name: string;

  @IsNumber()
  sport: number;
}
