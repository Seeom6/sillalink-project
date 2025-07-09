import { Injectable } from '@nestjs/common';
import { IServiceError } from 'src/package/error/service.error.interface';
import { ErrorCode } from '../../../common/error/error-code';

const TechnologyErrorMessages = {
  [ErrorCode.TECHNOLOGY_NOT_FOUND]: 'Technology not found',
  [ErrorCode.TECHNOLOGY_ALREADY_EXISTS]: 'Technology already exists',
  [ErrorCode.INVALID_PROFICIENCY_LEVEL]: 'Invalid proficiency level',
  [ErrorCode.TECHNOLOGY_IN_USE]: 'Technology is currently in use',
};

@Injectable()
export class TechnologyError extends IServiceError {
  constructor() {
    super(TechnologyErrorMessages, TechnologyError.name);
  }
}
