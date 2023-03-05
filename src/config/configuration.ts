import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configuration = () => ({
  port: parseInt(process.env.PORT) || 3000,
});

export const typeORMConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_HOST, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  }
}