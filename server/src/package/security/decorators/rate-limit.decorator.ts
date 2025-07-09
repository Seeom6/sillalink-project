import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
}

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);
