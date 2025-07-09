import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@Package/cache';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitOptions = this.reflector.getAllAndOverride<RateLimitOptions>('rateLimit', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rateLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request, rateLimitOptions.keyGenerator);
    
    const current = await this.redisService.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= rateLimitOptions.maxRequests) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Increment counter
    await this.redisService.set(
      key,
      (count + 1).toString(),
      Math.ceil(rateLimitOptions.windowMs / 1000)
    );

    return true;
  }

  private generateKey(request: any, customGenerator?: (req: any) => string): string {
    if (customGenerator) {
      return `rate_limit:${customGenerator(request)}`;
    }

    // Default: use IP address
    const ip = request.ip || request.connection.remoteAddress;
    const route = request.route?.path || request.url;
    return `rate_limit:${ip}:${route}`;
  }
}
