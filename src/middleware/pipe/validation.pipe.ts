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
    const errorCode = error.contexts;
    const errorMessage = error.constraints;

    if (!errorCode) {
      throw new CustomException(OthersException.NOT_VALIDATION_ERROR_CODE);
    }
    const key = Object.keys(errorCode)[0];
    return {
      code: errorCode[key]['code'],
      message: errorMessage[key],
    };
  }
}
