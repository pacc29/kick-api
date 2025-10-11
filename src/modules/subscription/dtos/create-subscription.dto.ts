import { IsInt } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  user_id: number;

  @IsInt()
  broadcaster_user_id: number;
}
