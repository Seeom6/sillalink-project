import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

@Injectable()
export class CSRFGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if CSRF protection is disabled for this route
    const skipCSRF = this.reflector.getAllAndOverride<boolean>('skipCSRF', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipCSRF) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const method = request.method.toUpperCase();

    // Only check CSRF for state-changing operations
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // Check for CSRF token in headers
    const csrfToken = request.headers['x-csrf-token'] || request.headers['csrf-token'];
    const sessionToken = request.session?.csrfToken;

    if (!csrfToken || !sessionToken) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (csrfToken !== sessionToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
