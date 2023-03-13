import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  providers: [
    {
      provide: 'S3_SERVICE',
      useClass: S3Service,
    },
  ],
  exports: ['S3_SERVICE'],
})
export class ServiceModule {}
