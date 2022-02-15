import { IsEmail, IsString } from 'class-validator';

export class LogInUserDTO {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
