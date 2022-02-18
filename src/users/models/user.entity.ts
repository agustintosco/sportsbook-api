import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

import { Role } from './roles.enum';
import { UserState } from './user-state.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @ApiProperty({
    name: 'id',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'role',
    type: String,
    example: '0',
    enum: Role,
  })
  @Column({
    name: 'roles',
    type: 'enum',
    nullable: false,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    name: 'firstName',
    type: String,
    example: 'Agustin',
  })
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  firstName: string;

  @ApiProperty({
    name: 'lastName',
    type: String,
    example: 'Tosco',
  })
  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  lastName: string;

  @ApiProperty({
    name: 'phone',
    type: String,
    example: '+465456454111',
  })
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone: string;

  @ApiProperty({
    name: 'email',
    type: String,
    example: 'agustin@greenrun.com',
  })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  email: string;

  @ApiHideProperty()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    nullable: false,
    select: false,
  })
  password: string;

  @ApiProperty({
    name: 'balance',
    type: Number,
    example: 750,
  })
  @Column({
    name: 'balance',
    type: 'integer',
    default: 0,
  })
  balance: number;

  @ApiProperty({
    name: 'address',
    type: String,
    example: '4 Privet Drive, Surrey',
  })
  @Column({
    name: 'address',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  address: string;

  @ApiProperty({
    name: 'gender',
    type: String,
    example: 'Male',
  })
  @Column({
    name: 'gender',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  gender: string;

  @ApiProperty({
    name: 'birthDate',
    type: Date,
    example: '01/01/1980',
  })
  @Column({
    name: 'birth_date',
    type: 'timestamp',
    nullable: true,
  })
  birthDate: Date;

  @ApiProperty({
    name: 'contryId',
    type: String,
    example: 'ARG',
  })
  @Column({
    name: 'country_id',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  countryId: string;

  @ApiProperty({
    name: 'city',
    type: String,
    example: 'Morteros',
  })
  @Column({
    name: 'city',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  city: string;

  @Column({
    name: 'category',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  category: string;

  @ApiProperty({
    name: 'documentId',
    type: String,
    example: '2135465',
  })
  @Column({
    name: 'document_id',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  documentId: string;

  @ApiProperty({
    name: 'userState',
    type: String,
    enum: UserState,
    example: '0',
  })
  @Column({
    type: 'enum',
    name: 'user_state',
    nullable: false,
    default: UserState.ACTIVE,
    enum: UserState,
  })
  userState: UserState;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    select: false,
  })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  public setBalance(amount: number): void {
    this.balance = amount;
  }
}
