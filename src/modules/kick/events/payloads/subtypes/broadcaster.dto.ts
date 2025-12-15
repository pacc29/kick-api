import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class BroadcasterDto {
  @IsBoolean()
  is_anonymous: boolean;

  @IsInt()
  user_id: number;

  @IsString()
  username: string;

  @IsBoolean()
  is_verified: boolean;

  @IsString()
  profile_picture: string;

  @IsString()
  channel_slug: string;

  @IsOptional()
  identity?: any;
}
