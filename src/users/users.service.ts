import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, Users } from '@prisma/client';
import { SignUpUserDto, SignInUserDto } from 'src/common/dto/users.dto';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { UsersRepository } from './users.repository';
import * as bcrpyt from 'bcrypt';

type ValidatePasswordType = 'signUp' | 'signIn';

@Injectable()
export class UsersService {
  private readonly tokenService: TokenService;

  constructor(private readonly usersRepository: UsersRepository) {
    this.tokenService = new TokenService(usersRepository);
  }

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  async signUp(data: SignUpUserDto): Promise<SignUp> {
    // 1. 이메일 중복 확인
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    // 2. 비밀번호 일치 여부
    await this._validatePassword(data.password, data.checkPassword);

    // 3. 중복 닉네임 확인
    await this._validateNickname(data.nickname);

    const { password, updatedAt, ...createdUser }: Users =
      await this.usersRepository.createUser(data);

    return {
      users: createdUser,
    };
  }

  async signIn(data: SignInUserDto): Promise<SignIn> {
    // 1. 유효성 검사
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }
    await this._validatePassword(data.password, user.password, 'signIn');

    // 2. 토큰 생성
    const payload: JwtPayload = { sub: user.id, nickname: user.nickname };

    const accessToken: string = this.tokenService.createAccessToken(payload);
    const refreshToken: string = await this.tokenService.createRefreshToken(
      payload,
    );

    return { accessToken, refreshToken };
  }

  private async _validatePassword(
    password: string,
    checkPassword: string,
    type: ValidatePasswordType = 'signUp',
  ) {
    if (type == 'signUp' && password !== checkPassword) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }

    if (type == 'signIn' && !(await bcrpyt.compare(password, checkPassword))) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }
  }

  private async _validateNickname(nickname: string) {
    const user: Users = await this.usersRepository.findUserByNickName(nickname);

    if (user) {
      throw new CustomException(UsersException.NICKNAME_ALREADY_EXISTS);
    }
  }

  async recreateAccessToken(
    refreshToken: string,
  ): Promise<RecreateAccessToken> {
    if (!refreshToken) {
      throw new CustomException(UsersException.TOKEN_NOT_EXISTS);
    }

    const verifiedUser: Users = await this.tokenService.verifyRefreshToken(
      refreshToken,
    );

    const payload: JwtPayload = {
      sub: verifiedUser.id,
      nickname: verifiedUser.nickname,
    };

    const accessToken = this.tokenService.createAccessToken(payload);
    return { accessToken };
  }
}

class TokenService {
  private readonly jwtService: JwtService;

  constructor(private readonly usersRepository: UsersRepository) {
    this.jwtService = new JwtService();
  }

  createAccessToken(payload: JwtPayload): string {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: 'access-secret-key', // 임시
      expiresIn: '3m', // 임시
    });

    return accessToken;
  }

  async createRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: 'refresh-secret-key',
      expiresIn: '10m',
    });

    // 암호화
    await this.usersRepository.createRefreshToken(payload.sub, refreshToken);
    return refreshToken;
  }

  async verifyRefreshToken(refreshToken: string): Promise<Users> {
    let verifiedToken;

    try {
      verifiedToken = this.jwtService.verify(refreshToken, {
        secret: 'refresh-secret-key',
      });
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          throw new CustomException(UsersException.EXPIRED_TOKEN);
        default:
          throw new CustomException(UsersException.UNVERIFIED_TOKEN);
      }
    }

    const user: Users = await this.usersRepository.findUserById(
      verifiedToken.sub,
    );

    // matches refreshToken in refreshToken model

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }

    return user;
  }
}
