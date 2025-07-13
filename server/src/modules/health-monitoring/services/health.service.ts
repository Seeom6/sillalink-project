import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RedisService } from '@Package/cache/redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly redisService: RedisService,
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

    const overallStatus = mongoStatus === 'connected' && redisStatus === 'connected' ? 'healthy' : 'unhealthy';

    return {
      status: overallStatus,
      timestamp,
      uptime: Math.floor(uptime),
      services: {
        mongodb: mongoStatus,
        redis: redisStatus,
      },
      version: 'v1',
    };
  }

  async getDetailedHealthStatus() {
    const basicHealth = await this.getHealthStatus();
    
    // Memory usage
    const memoryUsage = process.memoryUsage();
    
    // CPU usage (simplified)
    const cpuUsage = process.cpuUsage();
    
    return {
      ...basicHealth,
      system: {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      }
    };
  }

  async getDatabaseHealth() {
    try {
      const dbStats = await this.mongoConnection.db.stats();
      return {
        status: 'connected',
        readyState: this.mongoConnection.readyState,
        name: this.mongoConnection.name,
        host: this.mongoConnection.host,
        port: this.mongoConnection.port,
        stats: {
          collections: dbStats.collections,
          dataSize: Math.round(dbStats.dataSize / 1024 / 1024), // MB
          storageSize: Math.round(dbStats.storageSize / 1024 / 1024), // MB
          indexes: dbStats.indexes,
          indexSize: Math.round(dbStats.indexSize / 1024 / 1024), // MB
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        readyState: this.mongoConnection.readyState,
      };
    }
  }

  async getRedisHealth() {
    try {
      // Simple test to check Redis connection
      await this.redisService.set('health_check', 'ok', 10);
      const testValue = await this.redisService.get('health_check');

      return {
        status: 'connected',
        ping: testValue === 'ok' ? 'PONG' : 'ERROR',
        memory: {
          used: 0, // Simplified - would need Redis client access for actual memory usage
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
      };
    }
  }
}
