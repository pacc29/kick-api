import { Module } from '@nestjs/common';
import { KickController } from './kick.controller';
import { KickService } from './kick.service';
import { EventController } from './controllers/event.controller';
import { ChannelController } from './controllers/channel.controller';

@Module({
  controllers: [KickController, EventController, ChannelController],
  providers: [KickService],
  exports: [KickService]
})
export class KickModule {}
