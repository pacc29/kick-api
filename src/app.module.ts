import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KickModule } from './modules/kick/kick.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { NotExistsConstraint } from './common/validators/not-exists.validator';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'kick_api',
    entities: [User],
    autoLoadEntities: true,
    synchronize: true
  }), KickModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, NotExistsConstraint],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
