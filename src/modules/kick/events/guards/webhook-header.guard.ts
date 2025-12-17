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

    const {
      'kick-event-message-id': messageId,
      'kick-event-subscription-id': subscriptionId,
      'kick-event-signature': signature,
      'kick-event-message-timestamp': timestamp,
      'kick-event-type': eventType,
      'kick-event-version': version,
    } = request.headers;

    // const rawBody = (request as RawBodyRequest<FastifyRequest>).rawBody;

    // if (!rawBody) {
    //   return false;
    // }

    // if (!this.isValidSender(messageId, timestamp, signature, rawBody)) {
    //   return false;
    // }

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

    console.log(messageId);
    console.log(timestamp);
    console.log(signature);
    console.log(rawBody.toString());

    const message = Buffer.concat([
      Buffer.from(messageId),
      // Buffer.from('.'),
      Buffer.from(timestamp),
      // Buffer.from('.'),
      rawBody,
    ]);

    const signatureBytes = naclUtil.decodeBase64(signature);
    const publicKeyBytes = naclUtil.decodeBase64(publicKey);

    return nacl.sign.detached.verify(message, signatureBytes, publicKeyBytes);
  }

  private isValidEventType(eventType: string): boolean {
    return (Object.values(EVENT_TYPE) as string[]).includes(eventType);
  }
}
