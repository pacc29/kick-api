import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KickModule } from './kick/kick.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { NotExistsConstraint } from './inc/validators/not-exists.validator';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'kickapi',
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
