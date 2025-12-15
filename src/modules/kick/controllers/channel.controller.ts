import { Controller, Get, Query } from '@nestjs/common';
import { KickController } from '../kick.controller';
import { ChannelInfoDto } from '../channels/DTOs/channels.dto';

@Controller('kick/channel')
export class ChannelController extends KickController {
  @Get()
  async getChannelInfo(@Query() channelInfoDto: ChannelInfoDto) {
    const channelInfo = await this.kickService.getChannelInfo(channelInfoDto);

    return channelInfo;
  }
}
