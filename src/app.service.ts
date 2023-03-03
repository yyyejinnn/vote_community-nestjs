import { Injectable } from '@nestjs/common';
import { MyLogger } from './app/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: MyLogger) {}

  getHello(): string {
    this.logger.error('level: error');
    this.logger.warn('level: warn');
    this.logger.log('level: log');
    this.logger.verbose('level: verbose');
    this.logger.debug('level: debug');

    return 'Hello World!';
  }
}
