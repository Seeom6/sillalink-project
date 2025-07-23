'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiBriefcase, 
  FiAward, 
  FiBookOpen, 
  FiTrendingUp,
  FiCalendar,
  FiAlertTriangle,
  FiDollarSign,
  FiSettings
} from 'react-icons/fi';
import { Employee } from '@/lib/types/employee';
import { GlassCard } from '@/components/ui/glass-card';

interface EmployeeProfileTabsProps {
  employee: Employee;
  onUpdate?: (employee: Employee) => void;
}

type TabKey = 'overview' | 'professional' | 'performance' | 'projects' | 'training' | 'attendance' | 'discipline' | 'compensation' | 'settings';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const EmployeeProfileTabs: React.FC<EmployeeProfileTabsProps> = ({
  employee,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: Tab[] = [
    {
      key: 'overview',
      label: 'Overview',
      icon: FiUser
    },
    {
      key: 'professional',
      label: 'Professional',
      icon: FiBriefcase
    },
    {
      key: 'performance',
      label: 'Performance',
      icon: FiTrendingUp,
      count: employee.performanceReviews?.length || 0
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: FiAward,
      count: employee.projects?.length || 0
    },
    {
      key: 'training',
      label: 'Training',
      icon: FiBookOpen,
      count: employee.trainings?.length || 0
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: FiCalendar
    },
    {
      key: 'discipline',
      label: 'Discipline',
      icon: FiAlertTriangle,
      count: employee.disciplinaryActions?.length || 0
    },
    {
      key: 'compensation',
      label: 'Compensation',
      icon: FiDollarSign
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: FiSettings
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab employee={employee} />;
      case 'professional':
        return <ProfessionalTab employee={employee} />;
      case 'performance':
        return <PerformanceTab employee={employee} />;
      case 'projects':
        return <ProjectsTab employee={employee} />;
      case 'training':
        return <TrainingTab employee={employee} />;
      case 'attendance':
        return <AttendanceTab employee={employee} />;
      case 'discipline':
        return <DisciplineTab employee={employee} />;
      case 'compensation':
        return <CompensationTab employee={employee} />;
      case 'settings':
        return <SettingsTab employee={employee} />;
      default:
        return <OverviewTab employee={employee} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <GlassCard className="p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-violet text-white shadow-glow-sm' 
                    : 'text-primary-300 hover:bg-dark-700/50 hover:text-white'
                  }
                `}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`
                    rounded-full px-2 py-0.5 text-xs
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary-500/20 text-primary-400'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500 to-accent-violet"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Placeholder tab components - these will be implemented in separate files
const OverviewTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <div className="space-y-6">
    {/* Profile Header */}
    <GlassCard className="p-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-12 h-12 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{employee.firstName} {employee.lastName}</h2>
          <p className="text-lg text-primary-300">{employee.position}</p>
          {employee.jobTitle && employee.jobTitle !== employee.position && (
            <p className="text-sm text-primary-400">{employee.jobTitle}</p>
          )}
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              employee.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {employee.status}
            </span>
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
              {employee.department}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>

    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-white">{employee.projects?.length || 0}</div>
        <div className="text-sm text-primary-300">Projects</div>
      </GlassCard>
      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-white">{employee.trainings?.length || 0}</div>
        <div className="text-sm text-primary-300">Trainings</div>
      </GlassCard>
      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-white">{employee.achievements?.length || 0}</div>
        <div className="text-sm text-primary-300">Achievements</div>
      </GlassCard>
      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-white">
          {employee.performanceRating ? `${employee.performanceRating}/5` : 'N/A'}
        </div>
        <div className="text-sm text-primary-300">Performance</div>
      </GlassCard>
    </div>

    {/* Detailed Information */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-primary-400">Email:</span>
            <span className="text-white">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex justify-between">
              <span className="text-primary-400">Phone:</span>
              <span className="text-white">{employee.phone}</span>
            </div>
          )}
          {employee.gender && (
            <div className="flex justify-between">
              <span className="text-primary-400">Gender:</span>
              <span className="text-white">{employee.gender}</span>
            </div>
          )}
          {employee.maritalStatus && (
            <div className="flex justify-between">
              <span className="text-primary-400">Marital Status:</span>
              <span className="text-white">{employee.maritalStatus}</span>
            </div>
          )}
          {employee.nationalId && (
            <div className="flex justify-between">
              <span className="text-primary-400">National ID:</span>
              <span className="text-white">{employee.nationalId}</span>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Employment Details</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-primary-400">Employee ID:</span>
            <span className="text-white">{employee.employeeId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-400">Department:</span>
            <span className="text-white">{employee.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-400">Employment Type:</span>
            <span className="text-white">{employee.employmentType}</span>
          </div>
          {employee.contractType && (
            <div className="flex justify-between">
              <span className="text-primary-400">Contract Type:</span>
              <span className="text-white">{employee.contractType}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-primary-400">Hire Date:</span>
            <span className="text-white">{new Date(employee.hireDate).toLocaleDateString()}</span>
          </div>
          {employee.salary && (
            <div className="flex justify-between">
              <span className="text-primary-400">Salary:</span>
              <span className="text-white">${employee.salary.toLocaleString()}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>

    {/* Bio */}
    {employee.bio && (
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Bio</h4>
        <p className="text-primary-300">{employee.bio}</p>
      </GlassCard>
    )}

    {/* Skills */}
    {employee.skills && employee.skills.length > 0 && (
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {employee.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </GlassCard>
    )}
  </div>
);

const ProfessionalTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>
    <p className="text-primary-300">Professional details will be implemented here...</p>
  </GlassCard>
);

const PerformanceTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Performance Reviews</h3>
    <p className="text-primary-300">Performance reviews will be implemented here...</p>
  </GlassCard>
);

const ProjectsTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
    <p className="text-primary-300">Projects will be implemented here...</p>
  </GlassCard>
);

const TrainingTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Training & Certifications</h3>
    <p className="text-primary-300">Training records will be implemented here...</p>
  </GlassCard>
);

const AttendanceTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Attendance Summary</h3>
    <p className="text-primary-300">Attendance data will be implemented here...</p>
  </GlassCard>
);

const DisciplineTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Disciplinary Actions</h3>
    <p className="text-primary-300">Disciplinary records will be implemented here...</p>
  </GlassCard>
);

const CompensationTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Compensation & Benefits</h3>
    <p className="text-primary-300">Compensation details will be implemented here...</p>
  </GlassCard>
);

const SettingsTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <GlassCard className="p-6">
    <h3 className="text-xl font-semibold text-white mb-4">Employee Settings</h3>
    <p className="text-primary-300">Settings and preferences will be implemented here...</p>
  </GlassCard>
);
