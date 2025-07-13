import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { VerifyRegistrationOtpDto } from '../dto/request/register.dto';

@Injectable()
export class VerifyRegistrationOtpValidationPipe implements PipeTransform {
  transform(value: VerifyRegistrationOtpDto, metadata: ArgumentMetadata) {
    if (!value.email || !value.otp) {
      throw new Error('Email and OTP are required');
    }
    return value;
  }
}
