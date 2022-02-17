import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { CreateUserDTO } from './../users/models/create-user.dto';
import { LogInUserDTO } from './../users/models/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDTO) {
    await this.authService.checkEmail(user);

    await this.authService.create(user);
  }

  @ApiCreatedResponse({
    description: 'User logged.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Body() user: LogInUserDTO, @Req() req) {
    return this.authService.login(req.user, user.password);
  }
}
