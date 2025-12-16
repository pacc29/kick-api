import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EVENT_TYPE } from './events/headers/event-type.header';
import { ConfigService } from '@nestjs/config';
import qs from 'qs'; // Necesario para formatear el body
import {
  AccessTokenResponse,
  GetChannelInfoResponse,
  GetSubscriptionsResponse,
  SubscribeToEventResponse,
} from './responses/responses.interface';
import { EventBodyMap } from './events/maps/event.map';
import { LiveStreamStatusUpdatedDto } from './events/payloads/livestream-status-updated.dto';
import {
  GetSubscriptionsDto,
  SubscribeToEventBySlugDto,
  SubscribeToEventDto,
} from './events/DTOs/subscriptions.dto';
import { ChannelInfoDto } from './channels/DTOs/channels.dto';
import { EventDto } from './events/DTOs/subtypes/event.dto';
import { Api } from 'src/common/helpers/api';

export enum KICK_API_URLS {
  TOKEN = 'https://id.kick.com/oauth/token',
  CHANNELS = 'https://api.kick.com/public/v1/channels',
  SUBSCRIPTIONS = 'https://api.kick.com/public/v1/events/subscriptions',
}

@Injectable()
export class KickService {
  // private accessToken: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  // async onModuleInit() {
  //   this.accessToken = await this.getAppAccessToken();
  // }

  public async getChannelInfo(
    channelInfoDto: ChannelInfoDto,
  ): Promise<GetChannelInfoResponse> {
    const accessToken = await this.getAppAccessToken();

    const response = await Api.Get<GetChannelInfoResponse>(
      KICK_API_URLS.CHANNELS,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { slug: channelInfoDto.slug },
      },
    );

    if (!response.success) {
      throw new NotFoundException('Channel not found');
    }

    return response.data;
  }

  async subscribeToEvent(
    subscribeToEventBySlugDto: SubscribeToEventBySlugDto,
  ): Promise<string> {
    const accessToken = await this.getAppAccessToken();

    const channelInfo = await this.getChannelInfo({
      slug: subscribeToEventBySlugDto.slug,
    });

    if (!channelInfo || !channelInfo.data.length) {
      throw new NotFoundException('Channel not found');
    }

    const broadcasterUserId = channelInfo.data[0].broadcaster_user_id;
    const events: EventDto[] = subscribeToEventBySlugDto.events.map(
      (eventType: EVENT_TYPE) => ({ name: eventType, version: 1 }),
    );

    const subscribeToEventDto: SubscribeToEventDto = {
      broadcaster_user_id: broadcasterUserId,
      events: events,
      method: 'webhook',
    };

    const response = await Api.Post<SubscribeToEventResponse>(
      KICK_API_URLS.SUBSCRIPTIONS,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: subscribeToEventDto,
      },
    );

    if (!response.success) {
      throw new Error('Failed to subscribe to event');
    }

    const [data] = response.data.data;

    const subscriptionId = data.subscription_id;

    return subscriptionId;
  }

  async getSubscriptions(
    getSubscriptionsDto: GetSubscriptionsDto,
  ): Promise<GetSubscriptionsResponse> {
    const accessToken = await this.getAppAccessToken();

    const response = await Api.Get<GetSubscriptionsResponse>(
      KICK_API_URLS.SUBSCRIPTIONS,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          broadcaster_user_id: getSubscriptionsDto?.broadcaster_user_id,
        },
      },
    );

    if (!response.success) {
      throw new Error('Failed to get subscriptions');
    }

    return response.data;
  }

  private async getAppAccessToken(): Promise<string> {
    const clientId = this.configService.getOrThrow('CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('CLIENT_SECRET');
    const grantType = this.configService.getOrThrow('GRANT_TYPE');

    const response = await Api.Post<AccessTokenResponse>(
      KICK_API_URLS.TOKEN,
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

    if (!response.success) {
      throw new InternalServerErrorException('Failed to obtain access token');
    }

    return response.data.access_token;
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

  // ------ Webhook handles -------
  private async handleLiveStreamStatusUpdated(
    body: LiveStreamStatusUpdatedDto,
  ): Promise<string | void> {
    console.log('Live Stream Status Updated Event Body:', body);

    if (!body.is_live) {
      return; // No alert when user goes offline
    }

    const data = {
      channel_slug: body.broadcaster.channel_slug,
      title: body.title,
    };

    const message = `Streamer ${data.channel_slug} is now LIVE. Title: "${data.title}"`;
    console.log(message);

    return message;
  }

  private async handleLiveStreamMetadataUpdated() {}
}
