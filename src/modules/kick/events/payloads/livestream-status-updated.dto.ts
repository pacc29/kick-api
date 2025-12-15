import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { BroadcasterDto } from './subtypes/broadcaster.dto';

export class LiveStreamStatusUpdatedDto {
  broadcaster: BroadcasterDto;

  @IsBoolean()
  is_live: boolean;

  @IsString()
  title: string;

  @IsDateString()
  started_at: Date;

  @IsDateString()
  @IsOptional()
  ended_at?: Date | null;
}
