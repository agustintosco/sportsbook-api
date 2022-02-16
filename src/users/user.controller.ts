import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EditUserDTO, EditUserDTOAdmin } from './models/edit-user.dto';
import { Role } from './models/roles.enum';
import { UserState } from './models/user-state.enum';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('user_state') userState: UserState,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.getAll(
      {
        page,
        limit,
        route: '/users/all',
      },
      userState,
    );
  }

  @Get()
  @HttpCode(200)
  async findLoggedUser(@Req() req): Promise<User> {
    const id = req.user.id;

    return await this.userService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch()
  @HttpCode(201)
  async updateUserData(
    @Req() req,
    @Body() editUserDTO: EditUserDTO,
  ): Promise<void> {
    await this.userService.update(req.user.id, editUserDTO);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateUserDataById(
    @Param('id') id: number,
    @Body() editUserDTO: EditUserDTOAdmin,
  ): Promise<void> {
    let user = await this.userService.findOne(id);

    if (user.role == Role.ADMIN) {
      throw new HttpException('Cannot block an admin', HttpStatus.CONFLICT);
    }

    await this.userService.update(id, editUserDTO);
  }
}
