import { Controller } from '@nestjs/common';
import { BroadcastersService } from './broadcaster.service';
import { CreateBroadcasterDto } from './dtos/create-broadcaster.dto';

@Controller('broadcasters')
export class BroadcastersController {
  constructor(private broadcastersService: BroadcastersService) {}

  async create(createBroadcasterDto: CreateBroadcasterDto) {
    return await this.broadcastersService.createBroadcaster(
      createBroadcasterDto,
    );
  }
}
