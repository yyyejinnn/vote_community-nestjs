import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionObj } from './exception.message';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpRes = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const errorRes = response?.['stack'] ? response?.['response'] : response;

    return httpRes.status(status).json({
      error: {
        code: errorRes?.['code'] || status,
        message: errorRes?.['message'],
      },
    });
  }
}

export class CustomException extends HttpException {
  constructor(exceptionObj: ExceptionObj) {
    super(exceptionObj, HttpStatus.BAD_REQUEST);
  }
}
