import { Injectable } from '@nestjs/common';
import { IServiceError } from '@Package/error/service.error.interface';
import {ErrorCode} from "../../../common/error/error-code";

const EmployeeErrorMessages = {
    [ErrorCode.EMPLOYEE_NOT_FOUND]: 'Employee not found',
    [ErrorCode.EMPLOYEE_ALREADY_EXISTS]: 'Employee already exists',
};

@Injectable()
export class EmployeeError extends IServiceError {

    constructor(){
        super(EmployeeErrorMessages,EmployeeError.name)
    }
}
