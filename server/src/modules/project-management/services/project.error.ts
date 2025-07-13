import { Injectable } from '@nestjs/common';
import { IServiceError } from 'src/package/error/service.error.interface';
import { ErrorCode } from '../../../common/error/error-code';

const ProjectErrorMessages = {
  [ErrorCode.PROJECT_NOT_FOUND]: 'Project not found',
  [ErrorCode.PROJECT_ALREADY_EXISTS]: 'Project already exists',
  [ErrorCode.INVALID_PROJECT_DATA]: 'Invalid project data',
  [ErrorCode.UNAUTHORIZED_ACCESS]: 'Unauthorized access to project',
  [ErrorCode.MEMBER_ALREADY_EXISTS]: 'Member already exists in project',
  [ErrorCode.MEMBER_NOT_FOUND]: 'Member not found in project',
};

@Injectable()
export class ProjectError extends IServiceError {
  constructor() {
    super(ProjectErrorMessages, ProjectError.name);
  }
}
