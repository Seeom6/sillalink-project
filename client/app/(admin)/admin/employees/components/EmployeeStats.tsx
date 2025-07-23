'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiUserCheck,
  FiStar,
  FiClock,
  FiTrendingUp,
  FiUserX
} from 'react-icons/fi';
import { useEmployeeStats } from '@/lib/hooks/use-employees';
import { GlassCard } from '@/components/ui/glass-card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  isLoading 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-6 hover:bg-dark-800/30 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-primary-300 text-sm font-medium mb-1">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-dark-700/50 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-white mb-2">{value}</p>
            )}
            {trend && !isLoading && (
              <div className={`flex items-center text-sm ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                <FiTrendingUp 
                  size={14} 
                  className={`mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} 
                />
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const EmployeeStats: React.FC = () => {
  // Fetch real data from API
  const { data: stats, isLoading, error } = useEmployeeStats();

  // Fallback to zeros if no data
  const safeStats = {
    total: stats?.total || 0,
    active: stats?.active || 0,
    inactive: stats?.inactive || 0,
    onLeave: stats?.onLeave || 0,
    terminated: stats?.terminated || 0,
    featured: stats?.featured || 0,
    avgTenure: stats?.avgTenure || 0
  };

  // If there's an error, show error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 col-span-full">
          <div className="text-center text-red-400">
            <p>Failed to load employee statistics</p>
            <p className="text-sm text-primary-300 mt-1">Please try refreshing the page</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: safeStats.total,
      icon: FiUsers,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Employees',
      value: safeStats.active,
      icon: FiUserCheck,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Featured Employees',
      value: safeStats.featured,
      icon: FiStar,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Average Tenure',
      value: `${safeStats.avgTenure.toFixed(1)} years`,
      icon: FiClock,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'On Leave',
      value: safeStats.onLeave,
      icon: FiClock,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      trend: { value: 2, isPositive: false }
    },
    {
      title: 'Inactive',
      value: safeStats.inactive,
      icon: FiUserX,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      trend: { value: 1, isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
