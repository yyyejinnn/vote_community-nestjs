import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, RefreshTokens, Users } from '@prisma/client';
import { SignUpUserDto, SignInUserDto } from 'src/common/dto/users.dto';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  JwtPayload,
  RecreateAccessToken,
  SignIn,
  SignUp,
  VerifiedToken,
} from 'src/common/interface/users.interface';

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
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    await this._validatePassword(data.password, data.checkPassword);
    await this._validateNickname(data.nickname);

    const { password, updatedAt, ...createdUser }: Users =
      await this.usersRepository.createUser(data);

    return {
      users: createdUser,
    };
  }

  async signIn(data: SignInUserDto): Promise<SignIn> {
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }
    await this._validatePassword(data.password, user.password, 'signIn');

    // 토큰 생성
    const payload: JwtPayload = { sub: user.id, nickname: user.nickname };

    const accessToken: string = this.tokenService.createAccessToken(payload);
    const encryptRefreshToken: string =
      await this.tokenService.createRefreshToken(payload);

    return { accessToken, refreshToken: encryptRefreshToken };
  }

  async recreateAccessToken(
    refreshToken: string,
  ): Promise<RecreateAccessToken> {
    if (!refreshToken) {
      throw new CustomException(UsersException.TOKEN_NOT_EXISTS);
    }

    const verifiedUser: VerifiedToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    const payload: JwtPayload = {
      sub: verifiedUser.sub,
      nickname: verifiedUser.nickname,
    };

    const accessToken = this.tokenService.createAccessToken(payload);
    return { accessToken };
  }

  private async _validatePassword(
    password: string,
    checkPassword: string,
    type: ValidatePasswordType = 'signUp',
  ) {
    if (type == 'signUp' && password !== checkPassword) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }

    if (type == 'signIn' && !(await bcrypt.compare(password, checkPassword))) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }
  }

  private async _validateNickname(nickname: string) {
    const user: Users = await this.usersRepository.findUserByNickName(nickname);

    if (user) {
      throw new CustomException(UsersException.NICKNAME_ALREADY_EXISTS);
    }
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
    const encryptRefreshToken: string = this._encryptRefreshToken(refreshToken);

    await this.usersRepository.createRefreshToken(
      payload.sub,
      encryptRefreshToken,
    );

    return encryptRefreshToken;
  }

  async verifyRefreshToken(
    encryptRefreshToken: string,
  ): Promise<VerifiedToken> {
    let verifiedToken: VerifiedToken;

    const token: RefreshTokens = await this.usersRepository.findRefreshToken(
      encryptRefreshToken,
    );

    if (!token) {
      throw new CustomException(UsersException.UNVERIFIED_REFRESH_TOKEN);
    }

    const decryptRefreshToken: string =
      this._decryptRefreshToken(encryptRefreshToken);

    try {
      verifiedToken = this.jwtService.verify(decryptRefreshToken, {
        secret: 'refresh-secret-key',
      });
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          throw new CustomException(UsersException.EXPIRED_TOKEN);
        default:
          throw new CustomException(UsersException.UNVERIFIED_REFRESH_TOKEN);
      }
    }

    return verifiedToken;
  }

  private _encryptRefreshToken(refreshToken: string): string {
    const encrypt = crypto.createCipher('des', 'crypto-key'); // 임시
    const encryptResult =
      encrypt.update(refreshToken, 'utf8', 'base64') + encrypt.final('base64');

    return encryptResult;
  }

  private _decryptRefreshToken(encryptRefreshToken: string): string {
    const decrypt = crypto.createDecipher('des', 'crypto-key'); // 임시
    const decryptResult =
      decrypt.update(encryptRefreshToken, 'base64', 'utf8') +
      decrypt.final('utf8');

    return decryptResult;
  }
}
