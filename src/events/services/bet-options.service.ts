import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BetOption } from '../models/bet-option.entity';
import { CreateBetOptionDTO } from '../models/create-bet-option.dto';

@Injectable()
export class BetOptionService {
  constructor(
    @InjectRepository(BetOption)
    private betOptionRepository: Repository<BetOption>,
  ) {}

  async create(createBetOptionDTO: CreateBetOptionDTO) {
    const betOption: BetOption = await this.betOptionRepository.create(
      createBetOptionDTO,
    );

    await this.betOptionRepository.save(betOption);
  }
}
