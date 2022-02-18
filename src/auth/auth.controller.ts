import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
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

  @ApiOperation({
    summary: 'Register',
  })
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

  @ApiOperation({
    summary: 'Login',
  })
  @ApiCreatedResponse({
    description: 'User logged.',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MCwiZW1haWwiOiJhZ3VzdGluMUBnbWFpbC5jb20iLCJ1c2VyU3RhdGUiOjIsImlhdCI6MTY0NTIwMDc4Nn0.Z6aVU0gf4XUgM6-Z95uW_CYF5jRuJt6ly_IjOf4yhRU',
      },
    },
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
