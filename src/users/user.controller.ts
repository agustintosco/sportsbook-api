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
import {
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { EditUserDTO, EditUserDTOAdmin } from './models/edit-user.dto';
import { Role } from './models/roles.enum';
import { UserState } from './models/user-state.enum';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
        links: {
          first: '/users?limit=10',
          previous: '',
          next: '',
          last: '',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'Requiered page. Default value: 1',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'Number of items per page. Default value: 10',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'user_state',
    type: 'number',
    enum: UserState,
    required: false,
    example: UserState.ACTIVE,
  })
  @Roles(Role.ADMIN)
  @Get('all')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('user_state') userState?: UserState,
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

  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  @Get()
  @HttpCode(200)
  async findLoggedUser(@Req() req): Promise<User> {
    const id = req.user.id;

    return await this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Your user data has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @Patch()
  @HttpCode(201)
  async updateUserData(
    @Req() req,
    @Body() editUserDTO: EditUserDTO,
  ): Promise<void> {
    await this.userService.update(req.user.id, editUserDTO);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user data has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateUserDataById(
    @Param('id') id: number,
    @Body() editUserDTO: EditUserDTOAdmin,
  ): Promise<void> {
    const user = await this.userService.findOne(id);

    if (user.role == Role.ADMIN) {
      throw new HttpException('Cannot block an admin', HttpStatus.CONFLICT);
    }

    await this.userService.update(id, editUserDTO);
  }
}
