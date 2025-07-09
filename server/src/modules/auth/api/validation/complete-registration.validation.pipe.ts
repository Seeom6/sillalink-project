import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { CompleteRegistrationDto } from '../dto/request/register.dto';

export class CompleteRegistrationValidationPipe extends BaseValidationPipe<CompleteRegistrationDto> {
  constructor() {
    const schema = z.object({
      email: z.string().email('Invalid email format').toLowerCase(),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters'),
      confirmPassword: z.string().optional()
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });
    super(schema);
  }
}
