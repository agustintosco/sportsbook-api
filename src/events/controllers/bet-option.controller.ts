import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BetOptionService } from '../services/bet-options.service';
import { CreateBetOptionDTO } from '../models/create-bet-option.dto';

@Controller('events')
export class BetOptionController {
  constructor(private readonly betOptionService: BetOptionService) {}

  @Post('bet-options')
  @HttpCode(201)
  async create(@Body() createBetOptionDTO: CreateBetOptionDTO) {
    await this.betOptionService.create(createBetOptionDTO);
  }
}
