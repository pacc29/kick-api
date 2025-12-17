import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { KickController } from '../kick.controller';
import { EVENT_TYPE } from '../events/headers/event-type.header';
import { WebhookHeaderGuard } from '../events/guards/webhook-header.guard';
import {
  GetSubscriptionsDto,
  SubscribeToEventBySlugDto,
} from '../events/DTOs/subscriptions.dto';

@Controller('kick/event')
export class EventController extends KickController {
  @Get()
  async getSubscriptions(@Query() getSubscriptionsDto: GetSubscriptionsDto) {
    const subscriptions =
      await this.kickService.getSubscriptions(getSubscriptionsDto);

    return subscriptions;
  }

  @Post()
  async subscribeToEvent(@Body() subscribeToEventBySlugDto: SubscribeToEventBySlugDto) {
    const subscriptionId =
      await this.kickService.subscribeToEvent(subscribeToEventBySlugDto);

    return {
      message: 'Suscribed',
      subscription_id: subscriptionId,
    };
  }

  // https://docs.kick.com/events/webhook-security
  @UseGuards(WebhookHeaderGuard)
  @Post('webhook')
  async webhook(
    @Headers('Kick-Event-Type') eventType: EVENT_TYPE,
    @Headers('kick-event-subscription-id') subscriptionId: string,
    @Body() body: any,
  ) {
    const response = await this.kickService.handleWebhook(eventType, body);

    return { ok: 'ok' };
  }
}
