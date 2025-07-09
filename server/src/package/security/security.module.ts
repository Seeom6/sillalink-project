import { Module } from '@nestjs/common';
import { CSRFGuard } from './csrf.guard';
import { RateLimitGuard } from './rate-limit.guard';
import { AdminVerificationGuard } from './admin-verification.guard';
import { RedisModule } from '@Package/cache';
import { UserModule } from '@Modules/user';

@Module({
  imports: [RedisModule, UserModule],
  providers: [
    CSRFGuard,
    RateLimitGuard,
    AdminVerificationGuard,
  ],
  exports: [
    CSRFGuard,
    RateLimitGuard,
    AdminVerificationGuard,
  ],
})
export class SecurityModule {}
