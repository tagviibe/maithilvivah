import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let code = 'HTTP_EXCEPTION';
    let details: any[] = [];

    // Handle validation errors
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const responseObj = exceptionResponse as any;
      message = Array.isArray(responseObj.message)
        ? responseObj.message[0]
        : responseObj.message;
      details = Array.isArray(responseObj.message) ? responseObj.message : [];
      code = responseObj.error || code;
    }

    this.logger.error(
      `HTTP Exception: ${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
    );

    const errorResponse = new ErrorResponseDto(
      message,
      code,
      details.length > 0 ? details : undefined,
      request.url,
    );

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    this.logger.error(
      `Unhandled Exception: ${request.method} ${request.url} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse = new ErrorResponseDto(
      message,
      'INTERNAL_SERVER_ERROR',
      undefined,
      request.url,
    );

    response.status(status).json(errorResponse);
  }
}
