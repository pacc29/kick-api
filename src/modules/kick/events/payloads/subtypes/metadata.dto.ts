import { IsBoolean, IsString } from 'class-validator';

export class MetadataDto {
  @IsString()
  title: string;

  @IsString()
  language: string;

  @IsBoolean()
  has_mature_content: boolean;
}
