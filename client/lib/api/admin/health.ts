import apiClient from '../client';
import { ApiResponse } from '@/lib/types/api';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  redis: {
    status: 'connected' | 'disconnected';
    ping: string;
    memory: {
      used: number;
    };
  };
}

export const healthApi = {
  getOverall: (): Promise<ApiResponse<HealthStatus>> =>
    apiClient.get('/health'),

  getDatabase: (): Promise<ApiResponse<{ status: string; responseTime: number }>> =>
    apiClient.get('/health/database'),

  getRedis: (): Promise<ApiResponse<{ status: string; ping: string; memory: { used: number } }>> =>
    apiClient.get('/health/redis'),
};
