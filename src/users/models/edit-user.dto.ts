import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from './roles.enum';
import { UserState } from './user-state.enum';

export class EditUserDTO {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsNumber()
  phone: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  countryId: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  documentId: string;
}

export class EditUserDTOAdmin extends EditUserDTO {
  @IsOptional()
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;

  @IsOptional()
  @IsIn([UserState.ACTIVE, UserState.BLOCKED])
  userState: UserState;
}
