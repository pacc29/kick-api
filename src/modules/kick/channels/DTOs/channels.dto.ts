import { IsString } from "class-validator";

export class ChannelInfoDto {
    @IsString()
    slug: string;
}