import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Role } from './roles.enum';
import { UserState } from './user-state.enum';

export class EditUserDTO {
  @ApiPropertyOptional()
  @ApiProperty({
    name: 'firstName',
    type: String,
    example: 'Agustin',
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    name: 'lastName',
    type: String,
    example: 'Tosco',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    name: 'phone',
    type: String,
    example: '+465456454111',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    name: 'email',
    type: String,
    example: 'agustin@greenrun.com',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;

  @ApiProperty({
    name: 'address',
    type: String,
    example: '4 Privet Drive, Surrey',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    name: 'gender',
    type: String,
    example: 'Male',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({
    name: 'countryId',
    type: String,
    example: 'ARG',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryId: string;

  @ApiProperty({
    name: 'city',
    type: String,
    example: 'Morteros',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    name: 'documentId',
    type: String,
    example: '2135465',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentId: string;
}

export class EditUserDTOAdmin extends EditUserDTO {
  @ApiProperty({
    name: 'role',
    enum: Role,
    type: Role,
    example: 'admin',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;

  @ApiProperty({
    name: 'userState',
    enum: UserState,
    type: UserState,
    example: 'active',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([UserState.ACTIVE, UserState.BLOCKED])
  userState: UserState;
}
