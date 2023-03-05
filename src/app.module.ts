import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter, ResponseInterceptor } from './middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { VotesModule } from './app/votes/votes.module';
import { LoggerModule } from './app/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/settings';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ServiceModule } from './app/service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      ignoreEnvFile: true,
      envFilePath: ['.env.development'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    AuthModule,
    VotesModule,
    LoggerModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
