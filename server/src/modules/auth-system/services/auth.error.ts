import { Injectable } from '@nestjs/common';
import { IServiceError } from '@Package/error/service.error.interface';
import { ErrorCode } from "../../../common/error/error-code";

type ErrorMessages = Record<ErrorCode, string>;

export const AuthErrorMessages: ErrorMessages = {
  [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCode.PHONE_ALREADY_EXISTS]: 'Phone number already exists',
  [ErrorCode.OTP_EXPIRED]: 'OTP expired or not found',
  [ErrorCode.INVALID_OTP]: 'Invalid OTP',
  [ErrorCode.OTP_VERIFICATION_FAILED]: 'Failed to verify OTP',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCode.INVALID_RESET_TOKEN]: 'Invalid or expired password reset token',
  [ErrorCode.REFRESH_TOKEN_NOT_IN_REDIS]: 'refresh token not in redis',
  [ErrorCode.SIGN_IN_EMAIL_NOT_IN_REDIS]: 'please verify your email before sign in',
  [ErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified',
  [ErrorCode.REGISTRATION_DATA_EXPIRED]: 'Registration data expired',
  [ErrorCode.TOO_MANY_ATTEMPTS]: 'Too many attempts',
  [ErrorCode.USER_NOT_ALLOW]: 'User not allowed',
  [ErrorCode.INVALID_TOKEN]: 'Invalid token',
  [ErrorCode.EXPIRED_ACCESS_TOKEN]: 'Access token expired',
  [ErrorCode.EXPIRED_REFRESH_TOKEN]: 'Refresh token expired',
} as any;

@Injectable()
export class AuthError extends IServiceError {

  constructor(){
    super(AuthErrorMessages, AuthError.name)
  }

}
