import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './models/create-user.dto';
import { EditUserDTO } from './models/edit-user.dto';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async returnLoggedUser(id: number): Promise<Partial<User>> {
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
    let user: User = await this.userRepository.findOne(userId);

    user.setBalance(amount);

    await this.userRepository.save(user);
  }
}
