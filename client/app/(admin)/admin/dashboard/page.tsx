'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FiUsers,
  FiFolderPlus,
  FiCode,
  FiGlobe,
  FiActivity,
  FiSettings
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Manage users and roles',
      href: '/admin/users',
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
      count: '1,234'
    },
    {
      title: 'Employee Management',
      description: 'Manage employee profiles',
      href: '/admin/employees',
      icon: FiUsers,
      color: 'from-green-500 to-green-600',
      count: '56'
    },
    {
      title: 'Project Management',
      description: 'Manage projects and tasks',
      href: '/admin/projects',
      icon: FiFolderPlus,
      color: 'from-purple-500 to-purple-600',
      count: '23'
    },
    {
      title: 'Technology Management',
      description: 'Manage tech stack',
      href: '/admin/technologies',
      icon: FiCode,
      color: 'from-yellow-500 to-yellow-600',
      count: '45'
    },
    {
      title: 'Service Management',
      description: 'Manage business services',
      href: '/admin/services',
      icon: FiGlobe,
      color: 'from-red-500 to-red-600',
      count: '12'
    },
    {
      title: 'System Health',
      description: 'Monitor system status',
      href: '/admin/health',
      icon: FiActivity,
      color: 'from-indigo-500 to-indigo-600',
      count: '99.9%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">
          Welcome back, {user?.name || 'Administrator'}
        </p>
      </motion.div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <GlassCard
                  variant="secondary"
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 shadow-lg hover:shadow-xl hover:bg-slate-800/80"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-100">{card.count}</div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-purple-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300 transition-colors font-medium">
                      <span>Manage →</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
