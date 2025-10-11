import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async subscribe(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const newSubscription = await this.subscriptionsRepository.save(
      createSubscriptionDto,
    );

    return newSubscription
  }
}
