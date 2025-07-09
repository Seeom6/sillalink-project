import { IError } from '@Package/error/error.interface';
import { Injectable } from '@nestjs/common';
import { ErrorFactory } from '@Package/error';
import { IServiceError } from '@Package/error/service.error.interface';
import {ErrorCode} from "../../../common";

export const ProjectErrorMessages = {
  [ErrorCode.PROJECT_NOT_FOUND]: 'Project not found',
  [ErrorCode.PROJECT_ALREADY_EXISTS]: 'Project with this name already exists',
  [ErrorCode.INVALID_PROJECT_DATA]: 'Invalid project data',
  [ErrorCode.UNAUTHORIZED_ACCESS]: 'Unauthorized access to project',
  [ErrorCode.MEMBER_ALREADY_EXISTS]: 'Member already exists in project',
  [ErrorCode.MEMBER_NOT_FOUND]: 'Member not found in project',
};

@Injectable()
export class ProjectError extends IServiceError {

  constructor(){
    super(ProjectErrorMessages,ProjectError.name)
}
} 