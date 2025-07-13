import { Module } from '@nestjs/common';
import { HealthController } from './api/controllers/health.controller';
import { HealthService } from './services/health.service';
import { RedisModule } from '@Package/cache';

@Module({
  imports: [RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService]
})
export class HealthMonitoringModule {}
