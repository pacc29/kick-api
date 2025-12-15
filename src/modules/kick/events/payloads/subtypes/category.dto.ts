import { IsInt, IsString } from 'class-validator';

export class Category {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  thumbnail: string;
}
