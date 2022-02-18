import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('sports')
export class Sport {
  @ApiProperty({
    name: 'id',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'name',
    description: 'Name of the sport to be created',
    type: String,
    example: 'Basketball',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

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
}
