import { SetMetadata } from '@nestjs/common';

export const REQUIRES_ADMIN_VERIFICATION_KEY = 'requiresAdminVerification';
export const SENSITIVE_OPERATION_KEY = 'sensitiveOperation';

export const RequiresAdminVerification = () => SetMetadata(REQUIRES_ADMIN_VERIFICATION_KEY, true);
export const SensitiveOperation = () => SetMetadata(SENSITIVE_OPERATION_KEY, true);
