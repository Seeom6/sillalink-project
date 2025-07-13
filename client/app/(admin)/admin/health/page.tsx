'use client';

import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/admin/health';
import { queryKeys } from '@/lib/api/query-keys';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';

export default function HealthPage() {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: queryKeys.admin.health.overall(),
    queryFn: () => healthApi.getOverall(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: databaseData } = useQuery({
    queryKey: queryKeys.admin.health.database(),
    queryFn: () => healthApi.getDatabase(),
    refetchInterval: 30000,
  });

  const { data: redisData } = useQuery({
    queryKey: queryKeys.admin.health.redis(),
    queryFn: () => healthApi.getRedis(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading health status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading health status: {(error as any)?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  const health = healthData?.data;
  const database = databaseData?.data;
  const redis = redisData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health Monitoring</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor the health and performance of system components
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overall Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span>Overall Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`text-sm font-medium ${
                    health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {health?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime:</span>
                <span className="text-sm">
                  {health?.uptime ? `${Math.floor(health.uptime / 1000)}s` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="text-sm">{health?.version || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  database?.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span>Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`text-sm font-medium ${
                    database?.status === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {database?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Time:</span>
                <span className="text-sm">
                  {database?.responseTime ? `${database.responseTime}ms` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redis Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  redis?.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span>Redis Cache</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`text-sm font-medium ${
                    redis?.status === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {redis?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ping:</span>
                <span className="text-sm">{redis?.ping || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Memory Used:</span>
                <span className="text-sm">
                  {redis?.memory?.used ? `${redis.memory.used}MB` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Server Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span>Development</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">API Endpoints</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base URL:</span>
                  <span>{process.env.NEXT_PUBLIC_API_URL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Check:</span>
                  <span className="text-green-600">✓ Available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
