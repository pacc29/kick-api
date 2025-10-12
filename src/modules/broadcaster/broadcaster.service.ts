import { Inject, Injectable } from '@nestjs/common';
import { Broadcaster } from './entities/broadcaster.entity';
import { Repository } from 'typeorm';
import { CreateBroadcasterDto } from './dtos/create-broadcaster.dto';

@Injectable()
export class BroadcastersService {
  constructor(
    @Inject(Broadcaster)
    private broadcastersRepository: Repository<Broadcaster>,
  ) {}

  public async createBroadcaster(
    createBroadcasterDto: CreateBroadcasterDto,
  ): Promise<Broadcaster> {
    const broadcaster =
      await this.broadcastersRepository.save(createBroadcasterDto);

    return broadcaster;
  }
}
