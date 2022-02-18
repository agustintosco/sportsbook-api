import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { CreateUserDTO } from './models/create-user.dto';
import { EditUserDTO } from './models/edit-user.dto';
import { User } from './models/user.entity';
import { UserState } from './models/user-state.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    userState: UserState,
  ): Promise<Pagination<User>> {
    const users = this.userRepository.createQueryBuilder('users');

    if (userState) {
      users.andWhere(`users.user_state = :userState`, {
        userState: UserState[userState],
      });
    }

    return paginate<User>(users, options);
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async create(user: CreateUserDTO) {
    const newUser: User = await this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  async update(id: number, editUserDTO: EditUserDTO): Promise<void> {
    const user = await this.userRepository.findOne(id);

    this.userRepository.merge(user, editUserDTO);

    this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findPassword(id: number): Promise<string> {
    const foundUser = await this.userRepository.findOne(id, {
      select: ['password'],
    });
    return foundUser.password;
  }

  async setBalance(userId: number, amount: number) {
    const user: User = await this.userRepository.findOne(userId);

    user.setBalance(amount);

    await this.userRepository.save(user);
  }
}
