import {
  IsEmail,
  IsIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordMatch } from './../../auth/decorators/password-match.decorator';
import { Role } from './roles.enum';

export class CreateUserDTO {
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

  @IsString()
  @PasswordMatch('password', {
    message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
  })
  passwordConfirmation: string;

  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;

  @IsIn([Role.ADMIN, Role.USER])
  role: Role;
}
