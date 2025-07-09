import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { RegisterDto } from '../dto/request/register.dto';

export class RegisterValidationPipe extends BaseValidationPipe<RegisterDto> {
  constructor() {
    const schema = z.object({
      firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .regex(/^[\p{L}\p{M}\s'-]+$/u, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
      lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
      email: z.string()
        .email('Invalid email format')
        .toLowerCase()
        .refine((email) => {
          // Block common disposable email domains
          const disposableDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com', 'temp-mail.org',
            'throwaway.email', 'getnada.com', 'maildrop.cc'
          ];
          const domain = email.split('@')[1];
          return !disposableDomains.includes(domain);
        }, 'Disposable email addresses are not allowed')
        .refine((email) => {
          // Ensure email has valid format and reasonable length
          return email.length <= 254; // RFC 5321 limit
        }, 'Email address is too long')
    });
    super(schema);
  }
}
