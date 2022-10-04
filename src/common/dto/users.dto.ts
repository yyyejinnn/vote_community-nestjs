import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
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

  @Transform(({ value, obj }) => {
    if (value !== obj.password) {
      throw new BadRequestException('password mismatched');
    }
    return value;
  })
  @IsNotEmpty()
  checkPassword: string;
}
