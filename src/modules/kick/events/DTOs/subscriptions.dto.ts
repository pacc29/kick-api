import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { EventDto } from './subtypes/event.dto';
import { EVENT_TYPE } from '../headers/event-type.header';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsString()
  broadcaster_user_id?: string;
}

export class SubscribeToEventBySlugDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  events: EVENT_TYPE[] = [EVENT_TYPE.LIVESTREAM_STATUS_STREAM_UPDATED];
}

// DTO usado internamente
export class SubscribeToEventDto {
  @IsInt()
  broadcaster_user_id: number;

  @IsArray()
  events: EventDto[];

  @IsString()
  method: 'webhook';
}
