import { Injectable } from '@nestjs/common';
import { EVENT_TYPE } from './webhook/headers/event-type.header';
import { SuscribeDto } from './webhook/events/suscribe.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import qs from 'qs'; // Necesario para formatear el body
import { AccessTokenResponse } from './interfaces/access-token.interface';

@Injectable()
export class KickService {
  constructor(private readonly configService: ConfigService) {}
  async webhookDecider(eventType: EVENT_TYPE, body: any) {}

  async suscribe(suscribeDto: SuscribeDto) {}

  private async getAppAccessToken(): Promise<string> {
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
      // Error 500
    }

    return data.access_token;
  }
}
