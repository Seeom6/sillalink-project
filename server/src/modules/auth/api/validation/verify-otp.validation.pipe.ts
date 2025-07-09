import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { VerifyOtpDto } from '../dto/request/verify-otp.dto';

export class VerifyOtpValidationPipe extends BaseValidationPipe<VerifyOtpDto> {
    constructor() {
        super(z.object({
            access_token: z.string(),
            otp: z.string().length(6, 'OTP must be 6 digits')
        }));
    }
} 