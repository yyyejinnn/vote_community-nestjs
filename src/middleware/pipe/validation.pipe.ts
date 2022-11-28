import {
  HttpException,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ExceptionObj } from '../exception.filter/exception.message';

export class CustomValidationPipe extends NestValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]();
      }

      const errors = this.getExceptionObj(validationErrors);
      return new HttpException(errors, 400);
    };
  }

  protected getExceptionObj(validationErrors: ValidationError[]): ExceptionObj {
    const error = validationErrors[0];
    const errorCode = error.contexts;
    const errorMessage = error.constraints;

    if (!errorCode) {
      throw new HttpException(
        {
          code: '12345', // 임시
          message: 'error code가 정의되지 않았습니다.',
        },
        400,
      );
    }
    const key = Object.keys(errorCode)[0];
    return {
      code: errorCode[key]['code'],
      message: errorMessage[key],
    };
  }
}
