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

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
