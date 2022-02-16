import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models/user.entity';
import { CreateUserDTO } from './../users/models/create-user.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email.toLowerCase());

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const userData = {
      id: user.id,
      role: user.role,
      email: user.email,
      userState: user.userState,
    };

    return userData;
  }

  async validatePassword(dbPassword, password): Promise<any> {
    const passwordMatch = await bcrypt.compare(password, dbPassword);

    if (!passwordMatch) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.FORBIDDEN);
    }
  }

  async login(user: User, receivedPassword: string) {
    const dbPassword = await this.userService.findPassword(user.id);

    await this.validatePassword(dbPassword, receivedPassword);

    return {
      accessToken: this.jwtService.sign({ ...user }),
    };
  }

  async checkEmail(user: CreateUserDTO) {
    const userExists = await this.userService.findOneByEmail(
      user.email.toLowerCase(),
    );

    if (userExists) {
      throw new HttpException(
        'User is already registered',
        HttpStatus.CONFLICT,
      );
    }
  }

  async create(user: CreateUserDTO): Promise<void> {
    user.email = user.email.toLowerCase();
    user.password = await bcrypt.hash(user.password, 10);

    await this.userService.create(user);
  }
}
