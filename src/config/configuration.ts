import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

export const configuration = () => ({
  port: parseInt(process.env.PORT) || 3000,
});

export const typeORMConfig = (): TypeOrmModuleOptions => ({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
});

// export const redisConfig = (): ClientOpts => ({
//   store: redisStore,
//   host: process.env.REDIS_HOST,
//   port: parseInt(process.env.REDIS_PORT, 10) || 6379,
//   auth_pass: process.env.REDIS_AUTH_PASSWORD,
//   isGlobal: true,
// });
