import {
  JwtPayload,
  ResetPasswordDto,
  SignInUserDto,
  SignUpUserDto,
} from '@vote/common';

export interface TokenServiceInterface {
  createAccessToken(payload: JwtPayload);
  createRefreshToken(payload: JwtPayload);
  verifyRefreshToken(userId: number, encryptRefreshToken: string);
  deleteRefreshToken(userId: number);
}

export interface AuthServiceInterface {
  signUp(dto: SignUpUserDto);
  signIn(dto: SignInUserDto);
  signOut(userId: number);
  recreateAccessToken(userId: number, encryptRefreshToken: string);
  resetPassword(userId: number, dto: ResetPasswordDto);
}
