import { Injectable } from '@nestjs/common';
import { IServiceError } from '@Package/error/service.error.interface';
import {ErrorCode} from "../../../common/error/error-code";

const EmployeeErrorMessages = {
    [ErrorCode.EMPLOYEE_NOT_FOUND]: 'Employee not found',
    [ErrorCode.EMPLOYEE_ALREADY_EXISTS]: 'Employee already exists',
    [ErrorCode.EMPLOYEE_EMAIL_ALREADY_EXISTS]: 'Employee with this email already exists',
    [ErrorCode.INVALID_PROFICIENCY_LEVEL]: 'Invalid proficiency level',
    [ErrorCode.EMPLOYEE_IN_USE]: 'Employee is currently in use',
    [ErrorCode.INVALID_EMPLOYEE_STATUS]: 'Invalid employee status',
    [ErrorCode.INVALID_DEPARTMENT]: 'Invalid department',
    [ErrorCode.EMPLOYEE_CANNOT_BE_DELETED]: 'Employee cannot be deleted',
    [ErrorCode.EMPLOYEE_ALREADY_LINKED]: 'Employee is already linked to a user',
    [ErrorCode.USER_ALREADY_LINKED]: 'User is already linked to an employee',
};

@Injectable()
export class EmployeeError extends IServiceError {

    constructor(){
        super(EmployeeErrorMessages,EmployeeError.name)
    }
}
