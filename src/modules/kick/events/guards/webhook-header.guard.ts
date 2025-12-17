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

    const rawBody = (request as RawBodyRequest<FastifyRequest>).rawBody;

    if (!rawBody) {
      return false;
    }

    const messageIdStr = this.normalizeHeader(messageId);
    const timestampStr = this.normalizeHeader(timestamp);
    const signatureStr = this.normalizeHeader(signature);

    if (!messageIdStr || !timestampStr || !signatureStr) {
      return false;
    }

    if (
      !this.isValidSender(messageIdStr, timestampStr, signatureStr, rawBody)
    ) {
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
    const message = Buffer.concat([
      Buffer.from(messageId),
      Buffer.from('.'),
      Buffer.from(timestamp),
      Buffer.from('.'),
      rawBody,
    ]);

    const signatureBytes = naclUtil.decodeBase64(
      this.normalizeBase64(signature),
    );

    const publicKeyBytes = naclUtil.decodeBase64(publicKey);

    return nacl.sign.detached.verify(message, signatureBytes, publicKeyBytes);
  }

  private normalizeHeader(value: string | string[] | undefined): string | null {
    if (!value) return null;

    const v = Array.isArray(value) ? value[0] : value;

    return v.replace(/\s+/g, '').trim();
  }

  private normalizeBase64(value: string): string {
    let v = value.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');

    const pad = v.length % 4;
    if (pad) {
      v += '='.repeat(4 - pad);
    }

    return v;
  }

  private isValidEventType(eventType: string): boolean {
    return (Object.values(EVENT_TYPE) as string[]).includes(eventType);
  }
}
