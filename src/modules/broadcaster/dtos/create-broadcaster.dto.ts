import { IsInt, IsString } from 'class-validator';

export class CreateBroadcasterDto {
  @IsInt()
  id: number;

  @IsString()
  slug: string;
}
