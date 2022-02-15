import { Body, Controller, Get, HttpCode, Patch, Req } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EditUserDTO } from './models/edit-user.dto';
import { Role } from './models/roles.enum';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Roles(Role.ADMIN)
  async any() {}

  @Get()
  @HttpCode(200)
  async findOne(@Req() req) {
    const id = req.user.id;

    return await this.userService.returnLoggedUser(id);
  }

  @HttpCode(201)
  @Patch()
  async updateUserData(@Req() req, @Body() editUserDTO: EditUserDTO) {
    await this.userService.update(req.user.id, editUserDTO);
  }
}
