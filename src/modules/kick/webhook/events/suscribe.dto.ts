import { IsInt, IsString } from 'class-validator';
import { EVENT_TYPE } from '../headers/event-type.header';

export class SuscribeDto {
  @IsInt()
  broadcaster_user_id: number;

  events: Event[];

  @IsString()
  method: 'webhook';
}
