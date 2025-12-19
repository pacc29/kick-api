import { Module } from '@nestjs/common';
import { KickService } from './kick.service';
import { EventController } from './controllers/event.controller';
import { ChannelController } from './controllers/channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [EventController, ChannelController],
  providers: [KickService],
  exports: [KickService]
})
export class KickModule {}
