import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CustomValidationPipe } from 'src/middleware/pipe/validation.pipe';
import * as request from 'supertest';
import { MyLogger } from 'src/app/logger/logger.service';
import { UsersService } from 'src/app/users/users.service';

describe('users', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let userId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    app.useLogger(app.get(MyLogger));

    await app.init();
  });

  it('/profile GET', () => {
    return request(app.getHttpServer()).get('/users/profile').expect(200);
  });
  it('/written-votes GET', () => {
    return request(app.getHttpServer()).get('/users/written-votes').expect(200);
  });
  it('/written-comments GET', () => {
    return request(app.getHttpServer())
      .get('/users/written-comments')
      .expect(200);
  });

  afterAll(async () => {
    await usersService.deleteUser(userId);
    await app.close();
  });
});
