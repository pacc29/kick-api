import { IsArray, IsInt, IsString } from 'class-validator';
import { EVENT_TYPE } from '../headers/event-type.header';

export class SuscribeDto {
  @IsInt()
  broadcaster_user_id: number;

  @IsArray()
  events: {
    name: EVENT_TYPE.LIVESTREAM_STATUS_STREAM_UPDATED;
    version: '1';
  }[];

  @IsString()
  method: 'webhook';
}
