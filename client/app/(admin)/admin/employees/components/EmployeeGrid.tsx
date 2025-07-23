'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar
} from 'react-icons/fi';
import { Employee, EmployeeDepartment, EmployeeStatus } from '@/lib/types/employee';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface EmployeeGridProps {
  employees: Employee[];
  isLoading?: boolean;
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: (employee: Employee) => void;
}

// Helper function to validate and format image URLs
const getValidImageUrl = (imageUrl: string | undefined): string | null => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return null;
    }
  }

  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
  }

  // For other cases, try to construct a valid URL
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's not a valid URL, treat it as a relative path
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl}`;
  }
};

// Helper function to get department color
const getDepartmentColor = (department: EmployeeDepartment): string => {
  const colors = {
    [EmployeeDepartment.ENGINEERING]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [EmployeeDepartment.DESIGN]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [EmployeeDepartment.MARKETING]: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    [EmployeeDepartment.HR]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [EmployeeDepartment.FINANCE]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [EmployeeDepartment.OPERATIONS]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    [EmployeeDepartment.SALES]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [EmployeeDepartment.PRODUCT]: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    [EmployeeDepartment.QUALITY_ASSURANCE]: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    [EmployeeDepartment.CUSTOMER_SUPPORT]: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    [EmployeeDepartment.LEGAL]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    [EmployeeDepartment.OTHER]: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  return colors[department] || colors[EmployeeDepartment.OTHER];
};

// Helper function to get status color
const getStatusColor = (status: EmployeeStatus): string => {
  const colors = {
    [EmployeeStatus.ACTIVE]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [EmployeeStatus.INACTIVE]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    [EmployeeStatus.TERMINATED]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [EmployeeStatus.ON_LEAVE]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [EmployeeStatus.PROBATION]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    [EmployeeStatus.NOTICE_PERIOD]: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  return colors[status] || colors[EmployeeStatus.INACTIVE];
};

// Helper function to format department name
const formatDepartmentName = (department: EmployeeDepartment): string => {
  const names = {
    [EmployeeDepartment.ENGINEERING]: 'Engineering',
    [EmployeeDepartment.DESIGN]: 'Design',
    [EmployeeDepartment.MARKETING]: 'Marketing',
    [EmployeeDepartment.HR]: 'HR',
    [EmployeeDepartment.FINANCE]: 'Finance',
    [EmployeeDepartment.OPERATIONS]: 'Operations',
    [EmployeeDepartment.SALES]: 'Sales',
    [EmployeeDepartment.PRODUCT]: 'Product',
    [EmployeeDepartment.QUALITY_ASSURANCE]: 'QA',
    [EmployeeDepartment.CUSTOMER_SUPPORT]: 'Support',
    [EmployeeDepartment.LEGAL]: 'Legal',
    [EmployeeDepartment.OTHER]: 'Other'
  };
  return names[department] || 'Other';
};

// Helper function to format status name
const formatStatusName = (status: EmployeeStatus): string => {
  const names = {
    [EmployeeStatus.ACTIVE]: 'Active',
    [EmployeeStatus.INACTIVE]: 'Inactive',
    [EmployeeStatus.TERMINATED]: 'Terminated',
    [EmployeeStatus.ON_LEAVE]: 'On Leave',
    [EmployeeStatus.PROBATION]: 'Probation',
    [EmployeeStatus.NOTICE_PERIOD]: 'Notice Period'
  };
  return names[status] || 'Unknown';
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) => {
  const imageUrl = getValidImageUrl(employee.profileImage) || getValidImageUrl(employee.avatar);
  const fullName = `${employee.firstName} ${employee.lastName}`;
  
  // Calculate tenure
  const hireDate = new Date(employee.hireDate);
  const now = new Date();
  const tenureYears = ((now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <GlassCard className={`p-6 hover:bg-dark-800/30 transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary-500 bg-primary-500/10' : ''
      }`}>
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
            />
            {employee.isFeatured && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <FiStar className="w-4 h-4 fill-current" />
                <span className="text-xs font-medium">Featured</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <EnhancedButton
              variant="secondary"
              size="sm"
              onClick={onView}
              className="p-2"
            >
              <FiEye className="w-4 h-4" />
            </EnhancedButton>
            <EnhancedButton
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="p-2"
            >
              <FiEdit className="w-4 h-4" />
            </EnhancedButton>
            <EnhancedButton
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🗑️ Delete button clicked in EmployeeGrid');
                console.log('🗑️ Employee object being passed:', employee);
                console.log('🗑️ Employee _id:', employee._id);
                console.log('🗑️ Employee keys:', Object.keys(employee));
                onDelete(employee);
              }}
              className="p-2 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
              title={`Delete ${employee.firstName} ${employee.lastName}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </EnhancedButton>
          </div>
        </div>

        {/* Profile Image and Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            {imageUrl ? (
              <div className="w-16 h-16 relative">
                <Image
                  src={imageUrl}
                  alt={fullName}
                  fill
                  className="object-cover rounded-full"
                  onError={() => {
                    console.error('Image failed to load:', imageUrl);
                  }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
                <FiUser className="w-8 h-8 text-white" />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-800 ${
              employee.status === EmployeeStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-500'
            }`} />
          </div>

          {/* Debug info - remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 max-w-xs break-all">
              <div>Profile: {employee.profileImage || 'none'}</div>
              <div>Avatar: {employee.avatar || 'none'}</div>
              <div>Resolved URL: {imageUrl || 'none'}</div>
              <div>Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}</div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{fullName}</h3>
            <p className="text-primary-300 text-sm truncate">{employee.position}</p>
            <p className="text-primary-400 text-xs">ID: {employee.employeeId}</p>
          </div>
        </div>

        {/* Department and Status */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDepartmentColor(employee.department)}`}>
            {formatDepartmentName(employee.department)}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(employee.status)}`}>
            {formatStatusName(employee.status)}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-primary-300">
            <FiMail className="w-4 h-4" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center space-x-2 text-sm text-primary-300">
              <FiPhone className="w-4 h-4" />
              <span>{employee.phone}</span>
            </div>
          )}
          {(employee.address?.city || employee.city) && (
            <div className="flex items-center space-x-2 text-sm text-primary-300">
              <FiMapPin className="w-4 h-4" />
              <span>{employee.address?.city || employee.city}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-2 mb-4">
          {employee.jobTitle && (
            <div className="text-xs text-primary-400">
              <span className="font-medium">Role:</span> {employee.jobTitle}
            </div>
          )}
          {employee.nationalId && (
            <div className="text-xs text-primary-400">
              <span className="font-medium">ID:</span> {employee.nationalId}
            </div>
          )}
          {employee.gender && (
            <div className="text-xs text-primary-400">
              <span className="font-medium">Gender:</span> {employee.gender}
            </div>
          )}
          {employee.maritalStatus && (
            <div className="text-xs text-primary-400">
              <span className="font-medium">Status:</span> {employee.maritalStatus}
            </div>
          )}
        </div>

        {/* Performance & Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          {employee.performanceRating && (
            <div className="bg-dark-700/30 rounded p-2 text-center">
              <div className="text-primary-400">Performance</div>
              <div className="text-white font-semibold">{employee.performanceRating}/5</div>
            </div>
          )}
          {employee.salary && (
            <div className="bg-dark-700/30 rounded p-2 text-center">
              <div className="text-primary-400">Salary</div>
              <div className="text-white font-semibold">${employee.salary.toLocaleString()}</div>
            </div>
          )}
          {(employee.projects?.length || 0) > 0 && (
            <div className="bg-dark-700/30 rounded p-2 text-center">
              <div className="text-primary-400">Projects</div>
              <div className="text-white font-semibold">{employee.projects?.length || 0}</div>
            </div>
          )}
          {(employee.trainings?.length || 0) > 0 && (
            <div className="bg-dark-700/30 rounded p-2 text-center">
              <div className="text-primary-400">Trainings</div>
              <div className="text-white font-semibold">{employee.trainings?.length || 0}</div>
            </div>
          )}
        </div>

        {/* Tenure and Hire Date */}
        <div className="flex items-center justify-between text-xs text-primary-400">
          <div className="flex items-center space-x-1">
            <FiCalendar className="w-3 h-3" />
            <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiBriefcase className="w-3 h-3" />
            <span>{tenureYears} years</span>
          </div>
        </div>

        {/* Technologies & Skills */}
        {((employee.technologySkills && employee.technologySkills.length > 0) || (employee.skills && employee.skills.length > 0)) && (
          <div className="mt-4 pt-4 border-t border-dark-600">
            {employee.technologySkills && employee.technologySkills.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-primary-400 mb-2">Technologies ({employee.technologySkills.length})</p>
                <div className="flex flex-wrap gap-1">
                  {employee.technologySkills.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded-md"
                    >
                      {tech.technology?.name || 'Unknown'}
                    </span>
                  ))}
                  {employee.technologySkills.length > 3 && (
                    <span className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded-md">
                      +{employee.technologySkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {employee.skills && employee.skills.length > 0 && (
              <div>
                <p className="text-xs text-primary-400 mb-2">Skills ({employee.skills.length})</p>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {employee.skills.length > 4 && (
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-md">
                      +{employee.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  isLoading = false,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange
}) => {
  const allSelected = employees.length > 0 && employees.every(emp => selectedIds.includes(emp._id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-dark-700/50 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-dark-700/50 rounded w-3/4" />
                    <div className="h-3 bg-dark-700/50 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-dark-700/50 rounded" />
                  <div className="h-3 bg-dark-700/50 rounded w-2/3" />
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-dark-700/50 rounded-full flex items-center justify-center">
            <FiUser className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No employees found</h3>
            <p className="text-primary-300">Try adjusting your search criteria or add a new employee.</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with select all */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="size-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-primary-300">
              {allSelected ? 'Deselect all' : someSelected ? 'Select all' : 'Select all'}
            </span>
          </label>
          {selectedIds.length > 0 && (
            <span className="text-sm text-primary-400">
              {selectedIds.length} employee{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        {/* Items per page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-primary-300">Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-dark-700 border border-dark-600 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-primary-300">per page</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            isSelected={selectedIds.includes(employee._id)}
            onSelect={(selected) => onSelect(employee._id, selected)}
            onView={() => onView(employee)}
            onEdit={() => onEdit(employee)}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <EnhancedButton
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </EnhancedButton>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <EnhancedButton
                key={page}
                variant={currentPage === page ? "primary" : "secondary"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </EnhancedButton>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="text-primary-400">...</span>
              <EnhancedButton
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </EnhancedButton>
            </>
          )}

          <EnhancedButton
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </EnhancedButton>
        </div>
      )}
    </div>
  );
};
