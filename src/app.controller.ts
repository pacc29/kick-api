import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  async getHello(): Promise<any> {
    const hello = this.appService.getHello();

    return "Cat created";
  }
}
