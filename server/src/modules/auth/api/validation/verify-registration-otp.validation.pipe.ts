import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { VerifyRegistrationOtpDto } from '../dto/request/register.dto';

export class VerifyRegistrationOtpValidationPipe extends BaseValidationPipe<VerifyRegistrationOtpDto> {
  constructor() {
    const schema = z.object({
      email: z.string().email('Invalid email format').toLowerCase(),
      otp: z.string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers')
    });
    super(schema);
  }
}
