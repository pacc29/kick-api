import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionsDto {
  @IsOptional()
  @IsString()
  broadcaster_user_id?: string;
}
