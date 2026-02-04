import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // If data is already a ResponseDto, return it
        if (data instanceof ResponseDto) {
          return data;
        }

        // Extract message if provided in data
        const message = data?.message || 'Success';
        const responseData = data?.data !== undefined ? data.data : data;

        return new ResponseDto(true, message, responseData, path);
      }),
    );
  }
}
