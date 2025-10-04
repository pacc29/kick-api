import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPassword } from 'src/inc/helpers/password';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassord = await hashPassword(createUserDto.password)

        const newUser: CreateUserDto = {
            ...createUserDto,
            password: hashedPassord
        }

        return await this.usersRepository.save(newUser);
    }
}
