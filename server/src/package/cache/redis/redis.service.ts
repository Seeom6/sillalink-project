import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvironmentService } from "@Package/config";
import {TokenConstant} from "../../../common/auth/token.constant";

@Injectable()
export class RedisService implements OnModuleDestroy {
    private redis: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(
        private readonly envService: EnvironmentService
    ) {}

    async connect(){
        this.redis = new Redis({
            host: this.envService.get("redis.host"),
            port: this.envService.get("redis.port"),
            db: this.envService.get("redis.databaseIndex"),
        });

        this.redis.on('connect', () => {
            this.logger.log('✅ Connected to Redis');
        });

        this.redis.on('error', (err) => {
            this.logger.error(`❌ Redis connection error: ${err.message}`);
        });
    }
    async set(key: string, value: any, ttl?: number): Promise<void> {
        const val = typeof value === 'object' ? JSON.stringify(value) : value;
        this.logger.log(`Setting Redis key: ${key}, value: ${val}, ttl: ${ttl}`);
        await this.redis.set(key, val);
        if (ttl) {
            await this.redis.expire(key, ttl);
        }
        this.logger.log(`Successfully set Redis key: ${key}`);
    }

    async get<T = any>(key: string): Promise<T | null> {
        const val = await this.redis.get(key);
        try {
            return val ? JSON.parse(val) : null;
        } catch {
            return val as any;
        }
    }

    async del(key: string[]): Promise<number> {
        return this.redis.del(key);
    }

    async lpush(key: string, ...values: string[]): Promise<number> {
        return this.redis.lpush(key, ...values);
    }

    async lrange(key: string, start: number, end: number): Promise<string[]> {
        return this.redis.lrange(key, start, end);
    }

    async hset(key: string, field: string, value: any): Promise<number> {
        const val = typeof value === 'object' ? JSON.stringify(value) : value;
        return this.redis.hset(key, field, val);
    }

    async hget(key: string, field: string): Promise<any> {
        const val = await this.redis.hget(key, field);
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1;
    }

    async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    async getByPattern(pattern: string): Promise<{elements: string[]}> {
        const cursor = 0
        const result = await this.redis.scan(cursor, 'MATCH', `*${pattern}*`, 'COUNT', TokenConstant.MAX_USER_TOKEN_COUNT);
        return {
            elements: result[1]
        }
    }

    onModuleDestroy() {
        this.logger.log('👋 Disconnecting from Redis...');
        this.redis.disconnect();
        this.logger.log('🔌 Redis disconnected');
    }
}
