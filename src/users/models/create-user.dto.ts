import {
  IsEmail,
  IsIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordMatch } from './../../auth/decorators/password-match.decorator';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from './roles.enum';

export class CreateUserDTO {
  @ApiProperty({
    name: 'password',
    description: 'Password of the user',
    type: String,
    example: 'asffA423*arf',
  })
  @IsString()
  @MinLength(8, {
    message: 'PASSWORD_MIN_LENGTH: 8',
  })
  @MaxLength(16, {
    message: 'PASSWORD_MAX_LENGTH: 16',
  })
  @Matches(/\d/, { message: 'PASSWORD_MISSING: NUMBER' })
  @Matches(/[A-Z]/, {
    message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
  })
  @Matches(/[a-z]/, {
    message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
  })
  @Matches(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
    message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
  })
  password: string;

  @ApiProperty({
    name: 'passwordConfirmation',
    description: 'Password confirmation of the user',
    type: String,
    example: 'asffA423*arf',
  })
  @IsString()
  @PasswordMatch('password', {
    message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
  })
  passwordConfirmation: string;

  @ApiProperty({
    name: 'email',
    description: 'Email of the user',
    type: String,
    example: 'agustin@greenrun.com',
  })
  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;

  @ApiProperty({
    name: 'role',
    description:
      'Role of the user. FOR THIS DEMO, IT IS ALLOWED TO CHOSE YOUR ROLE',
    example: 0,
    enum: Role,
    type: Number,
  })
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;
}
