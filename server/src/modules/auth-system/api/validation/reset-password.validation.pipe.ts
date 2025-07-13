import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ResetPasswordValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.otp || !value.newPassword) {
      throw new Error('OTP and new password are required');
    }
    return value;
  }
}
