import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BetOptionService } from '../services/bet-options.service';
import { CreateBetOptionDTO } from '../models/create-bet-option.dto';
import { Roles } from './../../auth/decorators/roles.decorator';
import { Role } from 'src/users/models/roles.enum';
import { SetBetOptionResultDTO } from '../models/set-bet-option-resutl.dto';

@ApiTags('Bet Options')
@Controller('events/bet-options')
export class BetOptionController {
  constructor(private readonly betOptionService: BetOptionService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The bet option has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(201)
  async create(@Body() createBetOptionDTO: CreateBetOptionDTO) {
    await this.betOptionService.create(createBetOptionDTO);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The bet option result has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong.',
  })
  @Roles(Role.ADMIN)
  @Patch()
  @HttpCode(201)
  async setBetOptionResult(@Body() betOptionResultDTO: SetBetOptionResultDTO) {
    await this.betOptionService.setBetOptionResult(betOptionResultDTO);
  }
}
