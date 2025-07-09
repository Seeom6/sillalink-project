import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@Modules/user';
import { UserRole } from '@Modules/user';

@Injectable()
export class AdminVerificationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresAdminVerification = this.reflector.getAllAndOverride<boolean>('requiresAdminVerification', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresAdminVerification) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Verify user still exists and has admin role
    const currentUser = await this.userService.findById(user.id);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }

    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin role required for this operation');
    }

    if (!currentUser.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    // Additional verification for sensitive operations
    const sensitiveOperation = this.reflector.getAllAndOverride<boolean>('sensitiveOperation', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (sensitiveOperation) {
      // Check if user has performed recent authentication (within last 30 minutes)
      const lastAuthTime = request.session?.lastAuthTime;
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);

      if (!lastAuthTime || lastAuthTime < thirtyMinutesAgo) {
        throw new ForbiddenException('Recent authentication required for sensitive operations');
      }
    }

    return true;
  }
}
