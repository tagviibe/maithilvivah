import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({
    example: {
      timestamp: '2026-01-30T00:00:00.000Z',
      path: '/api/users',
      version: '1.0',
    },
  })
  meta: {
    timestamp: string;
    path?: string;
    version?: string;
  };

  constructor(success: boolean, message: string, data: T, path?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      path,
      version: '1.0',
    };
  }
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Error occurred' })
  message: string;

  @ApiProperty({
    example: {
      code: 'ERROR_CODE',
      details: [],
    },
  })
  error: {
    code: string;
    details?: any[];
  };

  @ApiProperty({
    example: {
      timestamp: '2026-01-30T00:00:00.000Z',
      path: '/api/users',
    },
  })
  meta: {
    timestamp: string;
    path?: string;
  };

  constructor(message: string, code: string, details?: any[], path?: string) {
    this.success = false;
    this.message = message;
    this.error = {
      code,
      details,
    };
    this.meta = {
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
