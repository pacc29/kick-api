import { Controller } from '@nestjs/common';
import { KickService } from './kick.service';

@Controller('kick')
export class KickController {
    constructor(protected readonly kickService: KickService){}
}
