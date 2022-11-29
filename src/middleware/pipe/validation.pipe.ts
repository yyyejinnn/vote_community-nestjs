import {
  HttpException,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ExceptionObj, OthersException } from '@vote/middleware';
import { CustomException } from '../exception.filter/http-exception.filter';

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

    // get code
    const errorCode = error.contexts;
    const key = errorCode ? Object.keys(errorCode)[0] : undefined;
    const code = errorCode?.[key]['code'];

    if (code === undefined) {
      throw new CustomException(OthersException.NOT_VALIDATION_ERROR_CODE);
    }

    // get message
    const message = error.constraints?.[key];

    return {
      code,
      message,
    };
  }
}
