import {ErrorCode} from "../../../common/error/error-code";

export const AuthErrorMessage = {
  [ErrorCode.EXPIRED_ACCESS_TOKEN]: 'Session expired',
  [ErrorCode.EXPIRED_REFRESH_TOKEN]: 'Session expired you should log in again',
  [ErrorCode.INVALID_TOKEN]: 'Invalid token',
};
