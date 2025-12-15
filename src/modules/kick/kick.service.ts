import { Injectable, OnModuleInit } from '@nestjs/common';
import { EVENT_TYPE } from './events/headers/event-type.header';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import qs from 'qs'; // Necesario para formatear el body
import {
  AccessTokenResponse,
  ErrorResponse,
  GetChannelInfoResponse,
  GetSubscriptionsResponse,
  SubscribeToEventResponse,
} from './responses/responses.interface';
import { EventBodyMap } from './events/maps/event.map';
import { LiveStreamStatusUpdatedDto } from './events/payloads/livestream-status-updated.dto';
import {
  GetSubscriptionsDto,
  SubscribeToEventDto,
} from './events/DTOs/subscriptions.dto';
import { ChannelInfoDto } from './channels/DTOs/channels.dto';

@Injectable()
export class KickService implements OnModuleInit {
  private accessToken: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.accessToken = await this.getAppAccessToken();
  }

  public async getChannelInfo(
    channelInfoDto: ChannelInfoDto,
  ): Promise<GetChannelInfoResponse | null> {
    const response = await axios.get<GetChannelInfoResponse | ErrorResponse>(
      `https://api.kick.com/public/v1/channels`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          slug: channelInfoDto.slug,
        },
      },
    );

    if (!response.data?.data) return null;

    const data = response.data;

    return data;
  }

  async subscribe(
    subscribeToEventDto: SubscribeToEventDto,
  ): Promise<string | null> {
    const response = await axios.post<SubscribeToEventResponse | ErrorResponse>(
      'https://api.kick.com/public/v1/events/subscriptions',
      subscribeToEventDto,
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

  async handleWebhook(eventType: EVENT_TYPE, body: EventBodyMap[EVENT_TYPE]) {
    console.log('Handling webhook event:', eventType);

    switch (eventType) {
      case EVENT_TYPE.LIVESTREAM_STATUS_STREAM_UPDATED:
        return await this.handleLiveStreamStatusUpdated(
          body as LiveStreamStatusUpdatedDto,
        );
    }
  }

  private async handleLiveStreamStatusUpdated(
    body: LiveStreamStatusUpdatedDto,
  ): Promise<string | void> {
    if (!body.is_live && !body.ended_at) {
      // No alert when user goes offline
      return;
    }

    const [user_id, username, profile_picture, channel_slug, is_live] = [
      body.broadcaster.user_id,
      body.broadcaster.username,
      body.broadcaster.profile_picture,
      body.broadcaster.channel_slug,
      body.is_live,
    ];
    const message = `Streamer ${username} | ${channel_slug}  is now LIVE. Title: "${body.title}"`;
    console.log(message);

    return message;
  }
}
