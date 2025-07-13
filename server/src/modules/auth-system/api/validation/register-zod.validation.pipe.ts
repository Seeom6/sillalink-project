import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { BaseValidationPipe } from 'src/package/api/pipes/base.validation.pipe';

// Phone number validation regex for international format
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(val => val.trim()),
    
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(val => val.trim()),
    
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters')
    .transform(val => val.toLowerCase().trim()),
    
  phone: z.string()
    .regex(phoneRegex, 'Invalid phone number format. Use international format (e.g., +1234567890)')
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
});

@Injectable()
export class RegisterZodValidationPipe extends BaseValidationPipe {
  constructor() {
    super(registerSchema);
  }
}
