import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositOrWithdrawalDTO {
  @ApiProperty({
    name: 'amount',
    description: 'Deposit/WIthdrawal amount',
    type: Number,
    example: 400,
  })
  @IsPositive()
  @IsNumber()
  amount: number;
}
