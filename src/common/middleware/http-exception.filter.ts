import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionObj } from '../interface/exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const exceptionObj = exception.getResponse();

    response.status(status).json({
      error: {
        code: exceptionObj['code'],
        message: exceptionObj['message'],
      },
    });
  }
}

export class CustomException extends HttpException {
  constructor(exceptionObj: ExceptionObj) {
    super(exceptionObj, HttpStatus.BAD_REQUEST);
  }
}
