import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async index() {
        return await this.userService.findAll()

    }

    @Post()
    async store(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
}
