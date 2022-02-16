import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { BetOption } from '../models/bet-option.entity';
import { CreateBetOptionDTO } from '../models/create-bet-option.dto';
import { SetBetOptionResultDTO } from '../models/set-bet-option-resutl.dto';

@Injectable()
export class BetOptionService {
  constructor(
    @InjectRepository(BetOption)
    private betOptionRepository: Repository<BetOption>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createBetOptionDTO: CreateBetOptionDTO) {
    const betOption: BetOption = await this.betOptionRepository.create(
      createBetOptionDTO,
    );

    await this.betOptionRepository.save(betOption);
  }

  async setBetOptionResult(betOptionResultDTO: SetBetOptionResultDTO) {
    let betOption: BetOption = await this.betOptionRepository.findOne(
      betOptionResultDTO.id,
    );

    if (betOption) {
      betOption.result = betOptionResultDTO.result;

      await this.betOptionRepository.save(betOption);

      this.eventEmitter.emit('bet-option.result-set', betOption);
    }
  }
}
