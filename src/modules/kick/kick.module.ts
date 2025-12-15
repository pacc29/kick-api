import { Module } from '@nestjs/common';
import { KickService } from './kick.service';
import { EventController } from './controllers/event.controller';
import { ChannelController } from './controllers/channel.controller';

@Module({
  controllers: [EventController, ChannelController],
  providers: [KickService],
  exports: [KickService]
})
export class KickModule {}
