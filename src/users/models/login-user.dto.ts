import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInUserDTO {
  @ApiProperty({
    name: 'password',
    type: String,
    example: 'asffA423*arf',
  })
  @IsString()
  password: string;

  @ApiProperty({
    name: 'email',
    type: String,
    example: 'agustin@greenrun.com',
  })
  @IsEmail()
  email: string;
}
