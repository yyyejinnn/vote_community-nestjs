import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SignUpUserDto,
  SignInUserDto,
  JwtPayload,
  VerifiedToken,
  ResetPasswordDto,
  UsersEntity,
} from '@vote/common';
import { CustomException, UsersException } from '@vote/middleware';

import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import {
  AuthServiceInterface,
  TokenServiceInterface,
} from './auth.service.interface';

import { UsersServiceInterface } from '../users/users.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type ValidatePasswordType = 'clearPassword' | 'hashedPassword';

@Injectable()
export class TokenService implements TokenServiceInterface {
  private readonly jwtService: JwtService;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.jwtService = new JwtService();
  }

  createAccessToken(payload: JwtPayload): string {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return accessToken;
  }

  async createRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const encryptRefreshToken: string = this._encryptRefreshToken(refreshToken);

    // redis 저장
    const ttl = +process.env.REFRESH_TOKEN_EXPIRATION_TIME;
    await this.cacheManager.set(`${payload.sub}`, 'encryptRefreshToken', ttl);

    return encryptRefreshToken;
  }

  async verifyRefreshToken(
    userId: number,
    encryptRefreshToken: string,
  ): Promise<VerifiedToken> {
    let verifiedToken: VerifiedToken;

    // get redis
    const token = await this.cacheManager.get(`${userId}`);
    if (!token) {
      throw new CustomException(UsersException.REFRESH_TOKEN_NOT_EXISTS);
    }

    // 복호화
    const decryptRefreshToken: string =
      this._decryptRefreshToken(encryptRefreshToken);

    try {
      verifiedToken = this.jwtService.verify(decryptRefreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
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

  async deleteRefreshToken(userId: number) {
    await this.cacheManager.del(`${userId}`);
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

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpUserDto) {
    const { email, nickname, password, checkPassword } = dto;

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    await this._validatePassword(password, checkPassword);
    await this._validateNickname(nickname);

    const entity = await UsersEntity.toEntity(email, nickname, password);
    return await this.usersRepository.insert(entity);
  }

  async signIn({ email, password }: SignInUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }
    const { password: userPw, id, nickname } = user;
    await this._validatePassword(password, userPw, 'hashedPassword');

    // 토큰 생성
    const payload: JwtPayload = { sub: id, nickname };

    const accessToken: string = this.tokenService.createAccessToken(payload);
    const encryptRefreshToken: string =
      await this.tokenService.createRefreshToken(payload);

    return { accessToken, refreshToken: encryptRefreshToken };
  }

  async signOut(userId: number) {
    return await this.tokenService.deleteRefreshToken(userId);
  }

  async recreateAccessToken(userId: number, encryptRefreshToken: string) {
    if (!encryptRefreshToken) {
      throw new CustomException(UsersException.TOKEN_NOT_EXISTS);
    }

    const { sub, nickname }: VerifiedToken =
      await this.tokenService.verifyRefreshToken(userId, encryptRefreshToken);

    const payload: JwtPayload = {
      sub,
      nickname,
    };

    return this.tokenService.createAccessToken(payload);
  }

  async resetPassword(
    userId: number,
    { password, checkPassword }: ResetPasswordDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (await bcrypt.compare(password, user.password)) {
      throw new CustomException(UsersException.SAME_CURR_PASSWORD);
    }
    await this._validatePassword(password, checkPassword);

    await this.usersRepository.update(userId, { password });
  }

  private async _validatePassword(
    password: string,
    checkPassword: string,
    type: ValidatePasswordType = 'clearPassword',
  ) {
    if (type == 'clearPassword' && password !== checkPassword) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }

    if (
      type == 'hashedPassword' &&
      !(await bcrypt.compare(password, checkPassword))
    ) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }
  }

  private async _validateNickname(nickname: string) {
    const user = await this.usersRepository.findOne({
      where: {
        nickname,
      },
    });

    if (user) {
      throw new CustomException(UsersException.NICKNAME_ALREADY_EXISTS);
    }
  }
}
