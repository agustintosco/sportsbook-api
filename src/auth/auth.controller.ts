import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { CreateUserDTO } from './../users/models/create-user.dto';
import { LogInUserDTO } from './../users/models/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDTO) {
    await this.authService.checkEmail(user);

    await this.authService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Body() user: LogInUserDTO, @Req() req) {
    return this.authService.login(req.user, user.password);
  }
}
