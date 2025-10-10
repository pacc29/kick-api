import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { WebhookHeaderGuard } from './guards/webhook-header.guard';
import { EVENT_TYPE } from './webhook/headers/event-type.header';
import { KickService } from './kick.service';
import { SuscribeDto } from './webhook/events/suscribe.dto';

@Controller('kick')
export class KickController {
  constructor(private readonly kickService: KickService) {}
  // @Get('access-token')
  // async getAccessToken() {
  //   await this.kickService.getAppAccessToken()
  // }

  // Hacer un interceptor para el webhook que verifique el sender validation https://docs.kick.com/events/webhook-security
  @UseGuards(WebhookHeaderGuard)
  @Post('webhook')
  async webhook(
    @Headers('kick-event-type') eventType: EVENT_TYPE,
    @Body() body: any,
  ) {
    console.log(eventType);

    return {
      hola: 'adioff',
    };
  }

  @Post('suscribe')
  async suscribe(@Body() suscribeDto: SuscribeDto) {

  }

}
