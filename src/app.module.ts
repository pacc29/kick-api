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
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/interfaces/environment.interface';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { Subscription } from './modules/subscription/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'mariadb',
        host: configService.getOrThrow('DB_HOST'),
        port: parseInt(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [User, Subscription],
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('NODE_ENV') === 'development',
      }),
    }),
    SubscriptionModule,
    KickModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotExistsConstraint,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
