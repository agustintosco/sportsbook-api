import { IsNumber, IsString } from 'class-validator';

export class CreateBetOptionDTO {
  @IsString()
  name: string;

  @IsNumber()
  odd: number;

  @IsNumber()
  event: number;
}
