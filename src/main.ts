import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './app/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, {
  //   logger: false,
  // });

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(MyLogger));

  await app.listen(3000);
}
bootstrap();
