import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ResetPasswordDto,
  SignInUserDto,
  SignUpUserDto,
  UsersEntity,
} from '@vote/common';
import { AppModule } from 'src/app.module';
import { AuthService, TokenService } from 'src/app/auth/auth.service';
import { UsersService } from 'src/app/users/users.service';

describe('Auth Service', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;

  beforeEach(async () => {
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
      id: 1,
    };

    it('signUp 201', async () => {
      usersService.findUserByWhereOption = jest.fn().mockReturnValue(undefined);
      usersService.createUser = jest
        .fn()
        .mockResolvedValue(
          UsersEntity.from(
            'test99@gmail.com',
            'test99',
            'test1234',
            new Date('2022-12-20T12:28:21.000Z'),
            new Date('2022-12-20T12:28:21.000Z'),
            1,
          ),
        );

      const signUp = await authService.signUp(signUpDto);

      expect(usersService.findUserByWhereOption).toBeCalledWith({
        email: 'test99@gmail.com',
      });
      expect(usersService.findUserByWhereOption).toBeCalledWith({
        nickname: 'test99',
      });
      expect(usersService.findUserByWhereOption).toBeCalledTimes(2);
      expect(usersService.createUser).toBeCalledWith(signUpDto);
      expect(usersService.createUser).toBeCalledTimes(1);
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
      usersService.findUserByWhereOption = jest
        .fn()
        .mockImplementation(async () => {
          return UsersEntity.from(
            'test99@gmail.com',
            'test99',
            'test1234',
            new Date('2022-12-20T12:28:21.000Z'),
            new Date('2022-12-20T12:28:21.000Z'),
          );
        });
      tokenService.createAccessToken = jest
        .fn()
        .mockReturnValue('access-token');

      tokenService.createRefreshToken = jest
        .fn()
        .mockReturnValue('hashed-refresh-token');

      const signIn = await authService.signIn(signInDto);

      expect(usersService.findUserByWhereOption).toBeCalledWith({
        email: 'test99@gmail.com',
      });
      expect(usersService.findUserByWhereOption).toBeCalledTimes(1);
      expect(tokenService.createAccessToken).toBeCalledTimes(1);
      expect(tokenService.createRefreshToken).toBeCalledTimes(1);
      expect(signIn).toStrictEqual(result);
    });
  });

  describe('recreateAccessToken', () => {
    const userId = 1;
    const encryptRefreshToken = 'encrypt-refreshtoken';
    it('recreateAccessToken 201', async () => {
      tokenService.verifyRefreshToken = jest
        .fn()
        .mockImplementation(async () => {
          return {
            sub: 1,
            nickname: 'test99',
            iat: 12345,
            exp: 67890,
          };
        });
      tokenService.createAccessToken = jest.fn().mockImplementation(() => {
        return 'new-access-token';
      });
      const recreateAccessToken = await authService.recreateAccessToken(
        userId,
        encryptRefreshToken,
      );

      expect(tokenService.verifyRefreshToken).toBeCalledTimes(1);
      expect(tokenService.verifyRefreshToken).toBeCalledWith(
        1,
        encryptRefreshToken,
      );
      expect(tokenService.createAccessToken).toBeCalledTimes(1);
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

  afterEach(async () => {
    await app.close();
  });
});
