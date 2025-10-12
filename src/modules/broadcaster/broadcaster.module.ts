import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Broadcaster } from 'typeorm/subscriber/Broadcaster.js';
import { BroadcastersService } from './broadcaster.service';
import { BroadcastersController } from './broadcaster.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcaster])],
  providers: [BroadcastersService],
  controllers: [BroadcastersController],
})
export class BroadcastersModule {}
