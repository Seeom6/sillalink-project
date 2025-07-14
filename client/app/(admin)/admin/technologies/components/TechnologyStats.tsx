'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCode,
  FiTrendingUp,
  FiStar,
  FiActivity
} from 'react-icons/fi';
// import { useTechnologyStats } from '@/lib/hooks/use-technologies';
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

export const TechnologyStats: React.FC = () => {
  // Mock data for now
  const stats = {
    total: 25,
    active: 20,
    featured: 8,
    learning: 3
  };
  const isLoading = false;

  const statCards = [
    {
      title: 'Total Technologies',
      value: stats?.total || 0,
      icon: FiCode,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Technologies',
      value: stats?.active || 0,
      icon: FiActivity,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Featured Technologies',
      value: stats?.featured || 0,
      icon: FiStar,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Learning',
      value: stats.learning,
      icon: FiTrendingUp,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      trend: { value: 5, isPositive: true }
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
