'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import { 
  EmployeeFilters, 
  EmployeeDepartment, 
  EmployeeStatus,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS
} from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface EmployeeFiltersPanelProps {
  filters: EmployeeFilters;
  onFiltersChange: (filters: Partial<EmployeeFilters>) => void;
  onReset: () => void;
}

export const EmployeeFiltersPanel: React.FC<EmployeeFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const hasActiveFilters = Boolean(
    filters.department || 
    filters.status || 
    filters.managerId ||
    filters.isFeatured
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <EnhancedButton
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="text-primary-300 hover:text-white"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
          </EnhancedButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Department Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => onFiltersChange({ 
              department: e.target.value as EmployeeDepartment || undefined 
            })}
            className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Departments</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ 
              status: e.target.value as EmployeeStatus || undefined 
            })}
            className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="createdAt">Date Created</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="position">Position</option>
            <option value="department">Department</option>
            <option value="hireDate">Hire Date</option>
          </select>
        </div>

        {/* Sort Order Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Sort Order
          </label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isFeatured || false}
              onChange={(e) => onFiltersChange({
                isFeatured: e.target.checked ? true : undefined
              })}
              className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-primary-300">
              Featured Employees Only
            </span>
          </label>
        </div>

        {/* Manager ID Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary-300">
            Manager ID (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter manager ID..."
            value={filters.managerId || ''}
            onChange={(e) => onFiltersChange({ 
              managerId: e.target.value || undefined 
            })}
            className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary-300">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.department && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Department: {DEPARTMENT_OPTIONS.find(d => d.value === filters.department)?.label}
                <button
                  onClick={() => onFiltersChange({ department: undefined })}
                  className="ml-2 text-primary-400 hover:text-white"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFiltersChange({ status: undefined })}
                  className="ml-2 text-primary-400 hover:text-white"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Featured Only
                <button
                  onClick={() => onFiltersChange({ isFeatured: undefined })}
                  className="ml-2 text-primary-400 hover:text-white"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.managerId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Manager: {filters.managerId}
                <button
                  onClick={() => onFiltersChange({ managerId: undefined })}
                  className="ml-2 text-primary-400 hover:text-white"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
