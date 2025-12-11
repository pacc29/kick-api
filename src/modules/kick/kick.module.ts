import { Module } from '@nestjs/common';
import { KickController } from './kick.controller';
import { KickService } from './kick.service';
import { EventController } from './controllers/event.controller';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  controllers: [KickController, EventController, WebhookController],
  providers: [KickService],
  exports: [KickService]
})
export class KickModule {}
