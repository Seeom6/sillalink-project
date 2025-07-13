import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class VerifyResetOtpValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.otp) {
      throw new Error('OTP is required');
    }
    return value;
  }
}
