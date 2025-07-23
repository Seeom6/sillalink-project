'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiX,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiUserCheck,
  FiUserX,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import { EmployeeStatus, EmployeeDepartment } from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: EmployeeStatus) => void;
  onBulkDepartmentChange?: (department: EmployeeDepartment) => void;
  onBulkExport?: () => void;
  onBulkFeaturedToggle?: (featured: boolean) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onBulkDepartmentChange,
  onBulkExport,
  onBulkFeaturedToggle
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <GlassCard className="p-4 min-w-[400px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">
                {selectedCount} employee{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <button
              onClick={onClearSelection}
              className="text-primary-400 hover:text-white transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Status Change Dropdown */}
            <div className="relative">
              <EnhancedButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowStatusMenu(!showStatusMenu);
                  setShowDepartmentMenu(false);
                }}
                className="flex items-center space-x-2"
              >
                <FiEdit className="w-4 h-4" />
                <span>Status</span>
              </EnhancedButton>

              {showStatusMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-full mb-2 right-0 bg-dark-800 border border-dark-600 rounded-lg shadow-xl py-2 min-w-[150px] z-10"
                >
                  <button
                    onClick={() => {
                      onBulkStatusChange(EmployeeStatus.ACTIVE);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-dark-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FiUserCheck className="w-4 h-4" />
                    <span>Set Active</span>
                  </button>
                  <button
                    onClick={() => {
                      onBulkStatusChange(EmployeeStatus.INACTIVE);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-dark-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FiUserX className="w-4 h-4" />
                    <span>Set Inactive</span>
                  </button>
                  <button
                    onClick={() => {
                      onBulkStatusChange(EmployeeStatus.ON_LEAVE);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-dark-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FiUserX className="w-4 h-4" />
                    <span>Set On Leave</span>
                  </button>
                  <button
                    onClick={() => {
                      onBulkStatusChange(EmployeeStatus.TERMINATED);
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-dark-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FiUserX className="w-4 h-4" />
                    <span>Set Terminated</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Featured Toggle */}
            {onBulkFeaturedToggle && (
              <>
                <EnhancedButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onBulkFeaturedToggle(true)}
                  className="flex items-center space-x-2"
                >
                  <FiStar className="w-4 h-4" />
                  <span>Feature</span>
                </EnhancedButton>
                
                <EnhancedButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onBulkFeaturedToggle(false)}
                  className="flex items-center space-x-2"
                >
                  <FiStar className="w-4 h-4" />
                  <span>Unfeature</span>
                </EnhancedButton>
              </>
            )}

            {/* Export */}
            {onBulkExport && (
              <EnhancedButton
                variant="secondary"
                size="sm"
                onClick={onBulkExport}
                className="flex items-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </EnhancedButton>
            )}

            {/* Delete */}
            <EnhancedButton
              variant="secondary"
              size="sm"
              onClick={onBulkDelete}
              className="flex items-center space-x-2 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </EnhancedButton>
          </div>
        </div>

        {/* Department Change Dropdown (if provided) */}
        {onBulkDepartmentChange && showDepartmentMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-dark-600"
          >
            <p className="text-sm text-primary-300 mb-2">Change Department:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EmployeeDepartment).map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    onBulkDepartmentChange(dept);
                    setShowDepartmentMenu(false);
                  }}
                  className="px-3 py-2 text-xs bg-dark-700 hover:bg-dark-600 text-primary-300 hover:text-white rounded-md transition-colors duration-200 capitalize"
                >
                  {dept.replace('_', ' ')}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
};
