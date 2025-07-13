import { Injectable } from '@nestjs/common';
import { IServiceError } from 'src/package/error/service.error.interface';
import { ErrorCode } from '../../../common/error/error-code';

const ServiceErrorMessages = {
  [ErrorCode.SERVICE_NOT_FOUND]: 'Service not found',
  [ErrorCode.SERVICE_ALREADY_EXISTS]: 'Service already exists',
};

@Injectable()
export class ServiceError extends IServiceError {
  constructor() {
    super(ServiceErrorMessages, ServiceError.name);
  }
}
