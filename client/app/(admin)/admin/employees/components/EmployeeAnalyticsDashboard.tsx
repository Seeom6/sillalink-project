'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiAward, 
  FiBookOpen,
  FiCalendar,
  FiDollarSign,
  FiTarget,
  FiActivity
} from 'react-icons/fi';
import { GlassCard } from '@/components/ui/glass-card';
import { Employee } from '@/lib/types/employee';

interface EmployeeAnalyticsDashboardProps {
  employees: Employee[];
}

interface AnalyticsCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const EmployeeAnalyticsDashboard: React.FC<EmployeeAnalyticsDashboardProps> = ({
  employees
}) => {
  // Calculate analytics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const featuredEmployees = employees.filter(emp => emp.isFeatured).length;
  
  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgPerformanceRating = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0) / employees.length
    : 0;

  const totalProjects = employees.reduce((sum, emp) => sum + (emp.projects?.length || 0), 0);
  const totalTrainings = employees.reduce((sum, emp) => sum + (emp.trainings?.length || 0), 0);
  const totalAchievements = employees.reduce((sum, emp) => sum + (emp.achievements?.length || 0), 0);

  const recentHires = employees.filter(emp => {
    const hireDate = new Date(emp.hireDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return hireDate >= thirtyDaysAgo;
  }).length;

  const analyticsCards: AnalyticsCard[] = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      subtitle: `${activeEmployees} active`,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
      trend: {
        value: recentHires,
        isPositive: true
      }
    },
    {
      title: 'Avg Performance',
      value: avgPerformanceRating.toFixed(1),
      subtitle: 'out of 5.0',
      icon: FiTrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Projects',
      value: totalProjects,
      subtitle: 'across all employees',
      icon: FiTarget,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Training Completed',
      value: totalTrainings,
      subtitle: 'certifications earned',
      icon: FiBookOpen,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Achievements',
      value: totalAchievements,
      subtitle: 'total recognitions',
      icon: FiAward,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Featured Staff',
      value: featuredEmployees,
      subtitle: 'highlighted employees',
      icon: FiActivity,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const topDepartments = Object.entries(departmentStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GlassCard className="p-4 hover:shadow-glow transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-primary-300 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                    {card.subtitle && (
                      <p className="text-xs text-primary-400">{card.subtitle}</p>
                    )}
                    {card.trend && (
                      <div className="flex items-center mt-2">
                        <span className={`text-xs ${card.trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {card.trend.isPositive ? '+' : '-'}{card.trend.value} this month
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} shadow-glow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-primary-400" />
              Department Distribution
            </h3>
            <div className="space-y-3">
              {topDepartments.map(([department, count], index) => {
                const percentage = (count / totalEmployees) * 100;
                
                return (
                  <div key={department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-300 capitalize">
                        {department.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-white font-medium">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-accent-violet h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiCalendar className="w-5 h-5 mr-2 text-primary-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800/30">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New employees hired</p>
                  <p className="text-xs text-primary-400">{recentHires} in the last 30 days</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Active employees</p>
                  <p className="text-xs text-primary-400">{activeEmployees} currently active</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-800/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Featured employees</p>
                  <p className="text-xs text-primary-400">{featuredEmployees} highlighted staff</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-primary-400" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-dark-800/30">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {employees.filter(emp => (emp.performanceRating || 0) >= 4).length}
              </div>
              <div className="text-sm text-primary-300">High Performers</div>
              <div className="text-xs text-primary-400">Rating ≥ 4.0</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-dark-800/30">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {employees.filter(emp => (emp.performanceRating || 0) >= 3 && (emp.performanceRating || 0) < 4).length}
              </div>
              <div className="text-sm text-primary-300">Good Performers</div>
              <div className="text-xs text-primary-400">Rating 3.0-3.9</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-dark-800/30">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {employees.filter(emp => (emp.performanceRating || 0) >= 2 && (emp.performanceRating || 0) < 3).length}
              </div>
              <div className="text-sm text-primary-300">Average Performers</div>
              <div className="text-xs text-primary-400">Rating 2.0-2.9</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-dark-800/30">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {employees.filter(emp => (emp.performanceRating || 0) < 2 && (emp.performanceRating || 0) > 0).length}
              </div>
              <div className="text-sm text-primary-300">Needs Improvement</div>
              <div className="text-xs text-primary-400">Rating  2.0</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
