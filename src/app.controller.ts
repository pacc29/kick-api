import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  async getHello(): Promise<any> {
    const hello = this.appService.getHello();

    return hello;
  }
}
