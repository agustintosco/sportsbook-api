import { IsNumber, IsPositive } from 'class-validator';

export class DepositOrWithdrawalDTO {
  @IsPositive()
  @IsNumber()
  amount: number;
}
