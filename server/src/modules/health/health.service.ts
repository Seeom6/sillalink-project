import { Injectable } from '@nestjs/common';
import { RedisService } from '@Package/cache';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class HealthService {
  constructor(
    private readonly redisService: RedisService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  async getHealthStatus() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    // Check MongoDB connection
    let mongoStatus = 'disconnected';
    try {
      if (this.mongoConnection.readyState === 1) {
        mongoStatus = 'connected';
      }
    } catch (error) {
      mongoStatus = 'error';
    }

    // Check Redis connection
    let redisStatus = 'disconnected';
    try {
      await this.redisService.get('health_check');
      redisStatus = 'connected';
    } catch (error) {
      redisStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp,
      uptime: Math.floor(uptime),
      database: {
        mongodb: mongoStatus,
        redis: redisStatus,
      },
      version: 'v1',
    };
  }
}
