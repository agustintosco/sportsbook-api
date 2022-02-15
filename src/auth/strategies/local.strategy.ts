import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './../auth.service';

/**
 * This strategy is used for the /auth/login endpoint to validate the user by email and password
 */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<any> {
    return await this.authService.validateUser(email);
  }
}
