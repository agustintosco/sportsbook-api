import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { EventService } from './../services/event.service';
import { CreateEventDTO } from './../models/create-event.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Event } from './../models/event.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from '../../users/models/roles.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  @HttpCode(200)
  async getAll(
    @Req() req,
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

  @Public()
  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') eventId: number): Promise<Event> {
    return await this.eventService.get(eventId);
  }

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  async create(@Body() createEventDTO: CreateEventDTO) {
    return await this.eventService.create(createEventDTO);
  }

  @Roles(Role.ADMIN)
  @Post('sports')
  @HttpCode(201)
  async createSport(@Body('name') name: string) {
    return await this.eventService.createSport(name);
  }
}
