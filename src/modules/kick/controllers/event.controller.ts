import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { KickController } from '../kick.controller';
import { KickService } from '../kick.service';
import { GetSubscriptionsDto } from '../webhook/events/getSubscriptions.dto';
import { SuscribeDto } from '../webhook/events/suscribe.dto';

@Controller('kick/event')
export class EventController extends KickController {
  constructor(private readonly kickService: KickService) {
    super();
  }

  @Get()
  async getSubscriptions(@Query() getSubscriptionsDto: GetSubscriptionsDto) {
    const subscriptions =
      await this.kickService.getSubscriptions(getSubscriptionsDto);

    return subscriptions;
  }

  @Post()
  async suscribe(@Body() suscribeDto: SuscribeDto) {
    const subscriptionId = await this.kickService.subscribe(suscribeDto);

    return {
      message: 'Suscribed',
      subscription_id: subscriptionId,
    };
  }
}
