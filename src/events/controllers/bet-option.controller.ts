import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { BetOptionService } from '../services/bet-options.service';
import { CreateBetOptionDTO } from '../models/create-bet-option.dto';
import { Roles } from './../../auth/decorators/roles.decorator';
import { Role } from 'src/users/models/roles.enum';
import { SetBetOptionResultDTO } from '../models/set-bet-option-resutl.dto';

@Controller('events/bet-options')
export class BetOptionController {
  constructor(private readonly betOptionService: BetOptionService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  async create(@Body() createBetOptionDTO: CreateBetOptionDTO) {
    await this.betOptionService.create(createBetOptionDTO);
  }

  @Roles(Role.ADMIN)
  @Patch()
  @HttpCode(201)
  async setBetOptionResult(@Body() betOptionResultDTO: SetBetOptionResultDTO) {
    await this.betOptionService.setBetOptionResult(betOptionResultDTO);
  }
}
