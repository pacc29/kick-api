import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { EventDto } from './subtypes/event.dto';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsString()
  broadcaster_user_id?: string;
}

export class SubscribeToEventDto {
  @IsInt()
  broadcaster_user_id: number;

  @IsArray()
  events: EventDto[];

  @IsString()
  method: 'webhook';
}
