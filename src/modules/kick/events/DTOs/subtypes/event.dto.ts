import { IsEnum, IsInt } from 'class-validator';
import { EVENT_TYPE } from '../../headers/event-type.header';

export class EventDto {
  @IsEnum(EVENT_TYPE)
  name: EVENT_TYPE;

  @IsInt()
  version: number;
}
