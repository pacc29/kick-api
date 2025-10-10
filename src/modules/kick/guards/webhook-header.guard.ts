import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EVENT_TYPE } from '../webhook/headers/event-type.header';

@Injectable()
export class WebhookHeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const {
      'kick-event-message-id': messageId,
      'kick-event-subscription-id': subscriptionId,
      'kick-event-signature': signature,
      'kick-event-message-timestamp': timestamp,
      'kick-event-type': eventType,
      'kick-event-version': version,
    } = request.headers;

    if (!this.isValidEventType(eventType)) {
      throw new BadRequestException('Invalid event Type');
    }

    return true;
  }

  private isValidEventType(eventType: string): boolean {
    return (Object.values(EVENT_TYPE) as string[]).includes(eventType);
  }
}
