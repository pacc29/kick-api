import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { state } from 'src/inc/enums/state.enum';

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

        return await this.usersRepository.save(newUser);
    }

    async emailExists(email: string): Promise<boolean> {
        return await this.usersRepository.createQueryBuilder()
            .where('email = :email', { email })
            .andWhere('state != :state', { state: state.STATE_DELETED })
            .getExists();
    }
}
