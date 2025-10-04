import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { state } from 'src/common/enums/state.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);

        const newUserSaved = await this.usersRepository.save(newUser);

        return plainToInstance(User, newUserSaved);
    }

    async emailExists(email: string): Promise<boolean> {
        return await this.usersRepository.createQueryBuilder()
            .where('email = :email', { email })
            .andWhere('state != :state', { state: state.STATE_DELETED })
            .getExists();
    }
}
