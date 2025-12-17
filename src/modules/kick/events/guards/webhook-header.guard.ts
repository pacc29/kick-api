import {
  CanActivate,
  ExecutionContext,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EVENT_TYPE } from '../headers/event-type.header';
import { FastifyRequest } from 'fastify';
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { publicKey } from '../../public-key';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookHeaderGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // const {
    //   'kick-event-message-id': messageId,
    //   'kick-event-subscription-id': subscriptionId,
    //   'kick-event-signature': signature,
    //   'kick-event-message-timestamp': timestamp,
    //   'kick-event-type': eventType,
    //   'kick-event-version': version,
    // } = request.headers;

    const messageId = request.headers['kick-event-message-id'] as string;
    const signature = request.headers['kick-event-signature'] as string;
    const timestamp = request.headers['kick-event-message-timestamp'] as string;
    const eventType = request.headers['kick-event-type'] as string;

    const rawBody = (request as RawBodyRequest<FastifyRequest>).rawBody;

    if (!rawBody) {
      return false;
    }

    if (!this.isValidSender(messageId, timestamp, signature, rawBody)) {
      return false;
    }

    if (!this.isValidEventType(eventType)) {
      return false;
    }

    return true;
  }

  private isValidSender(
    messageId: string,
    timestamp: string,
    signature: string,
    rawBody: Buffer,
  ): boolean {
    if (!messageId || !timestamp || !signature || !rawBody) {
      return false;
    }

    const message = Buffer.concat([
      Buffer.from(messageId),
      Buffer.from('.'),
      Buffer.from(timestamp),
      Buffer.from('.'),
      rawBody,
    ]);

    const signatureUint8 = naclUtil.decodeBase64(signature);
    const publicKeyUint8 = naclUtil.decodeBase64(publicKey);
    // const messageUint8 = new Uint8Array(message);

    return nacl.sign.detached.verify(
      message,
      signatureUint8,
      publicKeyUint8,
    );
  }

  private isValidEventType(eventType: string): boolean {
    return (Object.values(EVENT_TYPE) as string[]).includes(eventType);
  }
}
