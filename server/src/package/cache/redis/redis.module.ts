import {Module, Global, forwardRef, OnModuleInit} from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule implements OnModuleInit {
  constructor(private readonly redisServise: RedisService){}

  async onModuleInit() {
    await this.redisServise.connect();
  }
}
