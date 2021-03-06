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
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { EventService } from './../services/event.service';
import { CreateEventDTO } from './../models/create-event.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Event } from './../models/event.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from '../../users/models/roles.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { EditEventDTO } from '../models/edit-event.dto';

@ApiTags('Events & Sports')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({
    summary: 'Get all the Events',
  })
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
          first: '/events?limit=10',
          previous: '',
          next: '',
          last: '',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
  })
  @Public()
  @Get()
  @HttpCode(200)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Event>> {
    limit = limit > 100 ? 100 : limit;

    return this.eventService.getAll({
      page,
      limit,
      route: '/events',
    });
  }

  @ApiOperation({
    summary: 'Get Event by ID',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        name: 'Palmeiras vs Corintians',
        started: false,
        sport: { id: 1, name: 'La bolsita' },
        betOptions: [
          {
            id: 1,
            name: 'Palmeiras',
            odd: 1.5,
            result: null,
          },
          {
            id: 1,
            name: 'Draw',
            odd: 1.4,
            result: null,
          },
          {
            id: 1,
            name: 'Corintians',
            odd: 1.8,
            result: null,
          },
        ],
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 1,
  })
  @Public()
  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') eventId: number): Promise<Event> {
    return await this.eventService.get(eventId);
  }

  @ApiOperation({
    summary: 'Create an Event',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  async create(@Body() createEventDTO: CreateEventDTO) {
    /**
     *  First check if Sport exists before creating Event
     */

    const sport = await this.eventService.getSport(createEventDTO.sport);

    if (sport) {
      return await this.eventService.create(createEventDTO);
    } else {
      throw new HttpException('Sport not found', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Edit data of a given Event',
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'The user data has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    type: Number,
    required: true,
    example: 1,
  })
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @Patch(':id')
  async updateEventById(
    @Param('id') id: number,
    @Body() editEventDTO: EditEventDTO,
  ): Promise<void> {
    const event: Event = await this.eventService.get(id);

    if (event) {
      await this.eventService.update(id, editEventDTO);
    } else {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Create a Sport',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The sport has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Soccer',
      },
    },
  })
  @Roles(Role.ADMIN)
  @Post('sports')
  @HttpCode(201)
  async createSport(@Body('name') name: string) {
    return await this.eventService.createSport(name);
  }
}
