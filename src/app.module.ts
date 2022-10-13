import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/middleware/http-exception.filter';
import { ResponseInterceptor } from './common/middleware/http-response.interceptor';
import { UsersModule } from './users/users.module';
import { VotesService } from './votes/votes.service';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [UsersModule, VotesModule],
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
export class AppModule {}
