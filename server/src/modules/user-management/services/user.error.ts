import { Injectable } from '@nestjs/common';
import { IServiceError } from '@Package/error/service.error.interface';
import {ErrorCode} from "../../../common/error/error-code";

export const UserErrorMessages = {
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
    [ErrorCode.PHONE_ALREADY_EXISTS]: 'Phone number already exists',
};

@Injectable()
export class UserError extends IServiceError {

    constructor(){
        super(UserErrorMessages,UserError.name)
    }
}
