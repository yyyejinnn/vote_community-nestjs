import { PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  checkPassword: string;
}

export class SignInUserDto extends PickType(SignUpUserDto, [
  'email',
  'password',
]) {}

export class SignOutUserDto {
  userId: number;
}

export class ResetPasswordDto extends PickType(SignUpUserDto, [
  'password',
  'checkPassword',
]) {
  userId: number;
}
