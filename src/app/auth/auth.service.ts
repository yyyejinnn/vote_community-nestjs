import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SignUpUserDto,
  SignInUserDto,
  JwtPayload,
  RecreateAccessToken,
  VerifiedToken,
  WhereOptionByUserEmail,
  WhereOptionByUserNickName,
  ResetPasswordDto,
  UsersEntity,
} from '@vote/common';
import { CustomException, UsersException } from '@vote/middleware';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';

type ValidatePasswordType = 'clearPassword' | 'hashedPassword';

@Injectable()
export class AuthService {
  private readonly tokenService: TokenService;

  constructor(private readonly usersService: UsersService) {
    this.tokenService = new TokenService(usersService);
  }

  async signUp(dto: SignUpUserDto) {
    const { email, password, checkPassword, nickname } = dto;

    const whereOption: WhereOptionByUserEmail = {
      email: email,
    };
    const user = await this.usersService.findUserByWhereOption(whereOption);

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    await this._validatePassword(password, checkPassword);
    await this._validateNickname(nickname);

    const createdUser: UsersEntity = await this.usersService.createUser(dto);
    const { password: pw, updatedAt, ...userRes } = createdUser;

    return {
      users: userRes,
    };
  }

  async signIn({ email, password }: SignInUserDto) {
    const whereOption: WhereOptionByUserEmail = {
      email,
    };
    const user = await this.usersService.findUserByWhereOption(whereOption);

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
    return await this.usersService.signOut(userId);
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
    const { password: currPassword } =
      await this.usersService.findUserByWhereOption({
        id: userId,
      });

    if (await bcrypt.compare(password, currPassword)) {
      throw new CustomException(UsersException.SAME_CURR_PASSWORD);
    }
    await this._validatePassword(password, checkPassword);
    await this.usersService.updatePassword(userId, password);
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
    const whereOption: WhereOptionByUserNickName = { nickname };
    const user = await this.usersService.findUserByWhereOption(whereOption);

    if (user) {
      throw new CustomException(UsersException.NICKNAME_ALREADY_EXISTS);
    }
  }
}

class TokenService {
  private readonly jwtService: JwtService;

  constructor(private readonly usersService: UsersService) {
    this.jwtService = new JwtService();
  }

  createAccessToken(payload: JwtPayload): string {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: 'access-secret-key', // 임시
      expiresIn: '1h', // 임시
    });

    return accessToken;
  }

  async createRefreshToken(payload: JwtPayload): Promise<string> {
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: 'refresh-secret-key',
      expiresIn: '1d',
    });
    const encryptRefreshToken: string = this._encryptRefreshToken(refreshToken);

    await this.usersService.createRefreshToken(
      payload.sub,
      encryptRefreshToken,
    );

    return encryptRefreshToken;
  }

  async verifyRefreshToken(
    userId: number,
    encryptRefreshToken: string,
  ): Promise<VerifiedToken> {
    let verifiedToken: VerifiedToken;

    const token: UsersEntity = await this.usersService.findMatchedRefreshToken(
      userId,
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
