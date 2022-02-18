import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { BetOption } from './bet-option.entity';
import { Sport } from './sport.entity';

@Entity('events')
export class Event {
  @ApiProperty({
    name: 'id',
    type: Number,
    readOnly: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    name: 'sport',
    description: 'Sport ID related to the event',
    type: Number,
    example: 2,
  })
  @ManyToOne(() => Sport, { eager: true })
  @JoinColumn({ name: 'sport_id' })
  sport: number;

  @ApiProperty({
    name: 'name',
    description: 'Name of the event',
    type: String,
    example: 'Basketball',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ApiHideProperty()
  @Column({
    name: 'started',
    type: 'boolean',
    default: false,
  })
  started: boolean;

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

  @OneToMany(() => BetOption, (betOption) => betOption.event, { eager: true })
  betOptions: BetOption[];

  hasStarted(): boolean {
    return this.started ? true : false;
  }
}
