import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './app/logger/logger.service';
import { CustomValidationPipe } from './middleware/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, {
  //   logger: false,
  // });

  const configService = app.get(ConfigService);
  const host = configService.get<string>('port');

  app.useGlobalPipes(new CustomValidationPipe());
  app.useLogger(app.get(MyLogger));

  await app.listen(host);
}
bootstrap();
