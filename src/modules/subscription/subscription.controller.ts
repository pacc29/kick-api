import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { SubscriptionsService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @Post()
  async suscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const newSubscription = await this.subscriptionService.subscribe(
      createSubscriptionDto,
    );

    return newSubscription;
  }
}
