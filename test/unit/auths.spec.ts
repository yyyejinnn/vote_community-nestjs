import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  RefreshTokensEntity,
  ResetPasswordDto,
  SignInUserDto,
  SignUpUserDto,
  UsersEntity,
} from '@vote/common';
import exp from 'constants';
import { AppModule } from 'src/app.module';
import { AuthService, TokenService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { Repository } from 'typeorm';

describe('Users Service', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    tokenService = moduleRef.get<TokenService>(TokenService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('signUp', () => {
    const signUpDto: SignUpUserDto = {
      email: 'test99@gmail.com',
      nickname: 'test99',
      password: 'test1234',
      checkPassword: 'test1234',
    };
    const result = {
      email: 'test99@gmail.com',
      nickname: 'test99',
      createdAt: new Date('2022-12-20T12:28:21.000Z'),
    };

    it('signUp 201', async () => {
      const findUserByWhereOption = jest
        .spyOn(usersService, 'findUserByWhereOption')
        .mockImplementation(() => {
          return undefined;
        });
      const createdUser = jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValue(
          UsersEntity.from(
            'test99@gmail.com',
            'test99',
            'test1234',
            new Date('2022-12-20T12:28:21.000Z'),
            new Date('2022-12-20T12:28:21.000Z'),
          ),
        );
      const signUp = await authService.signUp(signUpDto);

      expect(findUserByWhereOption).toBeCalledWith({
        email: 'test99@gmail.com',
      });
      expect(findUserByWhereOption).toBeCalledWith({
        nickname: 'test99',
      });
      expect(findUserByWhereOption).toBeCalledTimes(2);
      expect(createdUser).toBeCalledWith(signUpDto);
      expect(createdUser).toBeCalledTimes(1);
      expect(signUp).toStrictEqual(result);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInUserDto = {
      email: 'test99@gmail.com',
      password: 'test1234',
    };
    const result = {
      accessToken: 'access-token',
      refreshToken: 'hashed-refresh-token',
    };
    it('signIn 200', async () => {
      const findUserByWhereOption = jest
        .spyOn(usersService, 'findUserByWhereOption')
        .mockImplementation(async () => {
          return UsersEntity.from(
            'test99@gmail.com',
            'test99',
            'test1234',
            new Date('2022-12-20T12:28:21.000Z'),
            new Date('2022-12-20T12:28:21.000Z'),
          );
        });
      const createAccessToken = jest
        .spyOn(tokenService, 'createAccessToken')
        .mockImplementation(() => {
          return 'access-token';
        });
      const createRefreshToken = jest
        .spyOn(tokenService, 'createRefreshToken')
        .mockImplementation(async () => {
          return 'hashed-refresh-token';
        });
      const signIn = await authService.signIn(signInDto);

      expect(findUserByWhereOption).toBeCalledWith({
        email: 'test99@gmail.com',
      });
      expect(findUserByWhereOption).toBeCalledTimes(1);
      expect(createAccessToken).toBeCalledTimes(1);
      expect(createRefreshToken).toBeCalledTimes(1);
      expect(signIn).toStrictEqual(result);
    });
  });

  describe.only('recreateAccessToken', () => {
    const userId = 1;
    const encryptRefreshToken = 'encrypt-refreshtoken';
    it('recreateAccessToken 201', async () => {
      const verifyRefreshToken = jest
        .spyOn(tokenService, 'verifyRefreshToken')
        .mockImplementation(async () => {
          return {
            sub: 1,
            nickname: 'test99',
            iat: 12345,
            exp: 67890,
          };
        });
      const createAccessToken = jest
        .spyOn(tokenService, 'createAccessToken')
        .mockImplementation(() => {
          return 'new-access-token';
        });
      const recreateAccessToken = await authService.recreateAccessToken(
        userId,
        encryptRefreshToken,
      );

      expect(verifyRefreshToken).toBeCalledTimes(1);
      expect(verifyRefreshToken).toBeCalledWith(1, encryptRefreshToken);
      expect(createAccessToken).toBeCalledTimes(1);
      expect(recreateAccessToken).toBe('new-access-token');
    });
  });

  describe('resetPassword', () => {
    const dto: ResetPasswordDto = {
      password: 'test9999',
      checkPassword: 'test9999',
    };

    it('resetPassword 200', async () => {
      usersService.findUserByWhereOption = jest.fn().mockResolvedValue({
        password:
          '$2b$10$jg0LKvIsfEPhNFjHC2PX0Oo3qO6y8PB8P8lAnvwOydulN3KaSRme2',
      });
      await authService.resetPassword(1, dto);

      expect(usersService.findUserByWhereOption).toBeCalledTimes(1);
    });
  });
});
