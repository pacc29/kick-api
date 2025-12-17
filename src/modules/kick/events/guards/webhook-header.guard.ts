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
import { createVerify } from 'crypto';

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
    try {
      // 1. El mensaje sigue siendo el mismo formato
      const message = `${messageId}.${timestamp}.${rawBody.toString('utf8')}`;

      // 2. Preparar la llave pública en formato PEM (con los headers)
      const pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

      // 3. Verificar usando el módulo nativo 'crypto' (RSA-SHA256)
      const verifier = createVerify('sha256'); // O el algoritmo que especifique Kick
      verifier.update(message);
      verifier.end();

      return verifier.verify(pemKey, signature, 'base64');
    } catch (error) {
      console.error('Error en verificación RSA:', error);
      return false;
    }
  }

  // private isValidSender(
  //   messageId: string,
  //   timestamp: string,
  //   signature: string,
  //   rawBody: Buffer,
  // ): boolean {
  //   if (!messageId || !timestamp || !signature || !rawBody) {
  //     return false;
  //   }

  //   const message = Buffer.concat([
  //     Buffer.from(messageId),
  //     Buffer.from('.'),
  //     Buffer.from(timestamp),
  //     Buffer.from('.'),
  //     rawBody,
  //   ]);

  //   const signatureUint8 = naclUtil.decodeBase64(signature);
  //   const publicKeyUint8 = naclUtil.decodeBase64(publicKey);
  //   const messageUint8 = new Uint8Array(message);

  //   return nacl.sign.detached.verify(
  //     messageUint8,
  //     signatureUint8,
  //     publicKeyUint8,
  //   );
  // }

  private isValidEventType(eventType: string): boolean {
    return (Object.values(EVENT_TYPE) as string[]).includes(eventType);
  }
}
