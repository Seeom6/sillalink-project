import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';

const VerifyResetOtpDto = z.object({
   otp: z.string().length(6),
});

@Injectable()
export class VerifyResetOtpValidationPipe extends BaseValidationPipe {
   constructor() {
      super(VerifyResetOtpDto);
   }
} 