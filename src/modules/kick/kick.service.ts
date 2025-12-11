import { Injectable, OnModuleInit } from '@nestjs/common';
import { EVENT_TYPE } from './webhook/headers/event-type.header';
import { SuscribeDto } from './webhook/events/suscribe.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import qs from 'qs'; // Necesario para formatear el body
import {
  AccessTokenResponse,
  ErrorResponse,
  GetSubscriptionsResponse,
  SubscribeResponse,
} from './interfaces/responses.interface';
import { GetSubscriptionsDto } from './webhook/events/getSubscriptions.dto';

@Injectable()
export class KickService implements OnModuleInit {
  private accessToken: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.accessToken = await this.getAppAccessToken();
  }

  async webhookDecider(eventType: EVENT_TYPE, body: any) {}

  async subscribe(suscribeDto: SuscribeDto): Promise<string | null> {
    const response = await axios.post<SubscribeResponse | ErrorResponse>(
      'https://api.kick.com/public/v1/events/subscriptions',
      suscribeDto,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.data?.data) return null;

    const [data] = response.data.data;

    const subscriptionId = data.subscription_id;

    return subscriptionId;
  }

  async getSubscriptions(
    getSubscriptionsDto: GetSubscriptionsDto,
  ): Promise<GetSubscriptionsResponse | null> {
    const response = await axios.get<GetSubscriptionsResponse | ErrorResponse>(
      'https://api.kick.com/public/v1/events/subscriptions',
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          broadcaster_user_id: getSubscriptionsDto?.broadcaster_user_id,
        },
      },
    );

    if (!response.data?.data) return null;

    const data = response.data;

    return data;
  }

  private async getAppAccessToken(): Promise<string | null> {
    const clientId = this.configService.getOrThrow('CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('CLIENT_SECRET');
    const grantType = this.configService.getOrThrow('GRANT_TYPE');

    const response = await axios.post<AccessTokenResponse>(
      'https://id.kick.com/oauth/token',
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const data = response.data;

    if (!data) {
      return null;
    }

    return data.access_token;
  }
}
