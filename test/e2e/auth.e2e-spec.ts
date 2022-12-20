import { INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CustomValidationPipe } from 'src/middleware/pipe/validation.pipe';
import * as request from 'supertest';
import { MyLogger } from 'src/app/logger/logger.service';
import { ResetPasswordDto, SignInUserDto, SignUpUserDto } from '@vote/common';
import { UsersService } from 'src/app/users/users.service';

describe('auth', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const DTO = {
    email: 'test@gmail.com',
    nickname: 'test',
    password: 'test1234',
    checkPassword: 'test1234',
  };
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

  it('/sign-up POST', async () => {
    const body: SignUpUserDto = DTO;
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(body)
      .expect(201)
      .then((user) => {
        console.log(user.body);
        userId = user.body.result.users.id;
      });
  });
  it('/sign-in POST', () => {
    const body: SignInUserDto = {
      email: DTO.email,
      password: DTO.password,
    };
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(body)
      .expect(201)
      .then((user) => {
        console.log(user.body);
      });
  });
  it('/reset/password PATCH', () => {
    const body: ResetPasswordDto = {
      password: 'test9999',
      checkPassword: 'test9999',
    };

    return request(app.getHttpServer())
      .patch('/auth/reset/password')
      .send(body)
      .expect(200);
  });
  it('/sign-out DELETE', () => {
    return request(app.getHttpServer()).delete('/auth/sign-out').expect(200);
  });

  afterAll(async () => {
    await usersService.deleteUser(userId);
    await app.close();
  });
});
