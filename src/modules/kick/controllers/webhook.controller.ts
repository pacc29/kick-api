import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { KickController } from '../kick.controller';
import { WebhookHeaderGuard } from '../guards/webhook-header.guard';
import { EVENT_TYPE } from '../webhook/headers/event-type.header';

@Controller('kick/webhook')
export class WebhookController extends KickController {
  constructor() {
    super();
  }

  // Hacer un interceptor para el webhook que verifique el sender validation https://docs.kick.com/events/webhook-security
  @UseGuards(WebhookHeaderGuard)
  @Post()
  async webhook(
    @Headers('Kick-Event-Type') eventType: EVENT_TYPE,
    @Headers('kick-event-subscription-id') subscriptionId: string,
    @Body() body: any,
  ) {
    console.log(eventType);

    return {
      hola: 'adioff',
    };
  }
}
