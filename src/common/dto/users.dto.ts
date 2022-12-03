import { PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpUserDto {
  @IsEmail(
    {},
    {
      context: {
        code: 'MUST_EMAIL_TYPE',
      },
    },
  )
  @IsNotEmpty({
    context: {
      code: 'EMPTY_EMAIL',
    },
  })
  email: string;

  @IsString({
    context: {
      code: 'MUST_STRING_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_NICKNAME',
    },
  })
  nickname: string;

  @IsString({
    context: {
      code: 'MUST_STRING_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_PASSWORD',
    },
  })
  password: string;

  @IsString({
    context: {
      code: 'MUST_STRING_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_PASSWORD',
    },
  })
  checkPassword: string;
}

export class SignInUserDto extends PickType(SignUpUserDto, [
  'email',
  'password',
]) {}

export class SignOutUserDto {
  @IsNotEmpty({
    context: {
      code: 'EMPTY_USER_ID',
    },
  })
  userId: number;
}

export class ResetPasswordDto extends PickType(SignUpUserDto, [
  'password',
  'checkPassword',
]) {
  @IsNotEmpty({
    context: {
      code: 'EMPTY_USER_ID',
    },
  })
  userId: number;
}
