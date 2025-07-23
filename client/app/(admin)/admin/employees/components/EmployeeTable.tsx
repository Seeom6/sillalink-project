'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiChevronUp,
  FiChevronDown,
  FiStar
} from 'react-icons/fi';
import { Employee, EmployeeDepartment, EmployeeStatus, EmployeeSortField, SortOrder } from '@/lib/types/employee';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface EmployeeTableProps {
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
  sortBy: string;
  sortOrder: SortOrder;
  onSort: (field: EmployeeSortField, order: SortOrder) => void;
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

// Helper function to get status color
const getStatusColor = (status: EmployeeStatus): string => {
  const colors = {
    [EmployeeStatus.ACTIVE]: 'text-green-400',
    [EmployeeStatus.INACTIVE]: 'text-gray-400',
    [EmployeeStatus.TERMINATED]: 'text-red-400',
    [EmployeeStatus.ON_LEAVE]: 'text-yellow-400',
    [EmployeeStatus.PROBATION]: 'text-orange-400',
    [EmployeeStatus.NOTICE_PERIOD]: 'text-purple-400'
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

interface SortableHeaderProps {
  field: EmployeeSortField;
  currentSort: string;
  currentOrder: SortOrder;
  onSort: (field: EmployeeSortField, order: SortOrder) => void;
  children: React.ReactNode;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  currentSort,
  currentOrder,
  onSort,
  children
}) => {
  const isActive = currentSort === field;
  const nextOrder: SortOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc';

  return (
    <button
      onClick={() => onSort(field, nextOrder)}
      className="flex items-center space-x-1 text-left font-medium text-primary-300 hover:text-white transition-colors duration-200"
    >
      <span>{children}</span>
      {isActive ? (
        currentOrder === 'asc' ? (
          <FiChevronUp className="w-4 h-4" />
        ) : (
          <FiChevronDown className="w-4 h-4" />
        )
      ) : (
        <div className="w-4 h-4" />
      )}
    </button>
  );
};

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
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
  onLimitChange,
  sortBy,
  sortOrder,
  onSort
}) => {
  const allSelected = employees.length > 0 && employees.every(emp => selectedIds.includes(emp._id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-dark-700/50 rounded w-1/4" />
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-12 bg-dark-700/50 rounded" />
          ))}
        </div>
      </GlassCard>
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
      {/* Header with select all and items per page */}
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

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600 bg-dark-800/30">
                <th className="px-4 py-4 text-left sm:px-6">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="size-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader
                    field="email"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={onSort}
                  >
                    Email
                  </SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader
                    field="position"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={onSort}
                  >
                    Position
                  </SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader
                    field="department"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={onSort}
                  >
                    Department
                  </SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">
                  <SortableHeader
                    field="hireDate"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={onSort}
                  >
                    Hire Date
                  </SortableHeader>
                </th>
                <th className="px-6 py-4 text-left">Performance</th>
                <th className="px-6 py-4 text-left">Salary</th>
                <th className="px-6 py-4 text-left">Projects</th>
                <th className="px-6 py-4 text-left">Technologies</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const employeeId = employee._id;
                const imageUrl = getValidImageUrl(employee.profileImage) || getValidImageUrl(employee.avatar);
                const fullName = `${employee.firstName} ${employee.lastName}`;
                
                return (
                  <motion.tr
                    key={employeeId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-dark-700/50 hover:bg-dark-800/30 transition-colors duration-200 ${
                      selectedIds.includes(employeeId) ? 'bg-primary-500/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(employeeId)}
                        onChange={(e) => onSelect(employeeId, e.target.checked)}
                        className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          return imageUrl ? (
                            <div className="w-8 h-8 relative">
                              <Image
                                src={imageUrl}
                                alt={fullName}
                                fill
                                className="object-contain rounded"
                                onError={() => {
                                  // Handle image load error silently
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-white" />
                            </div>
                          );
                        })()}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-white">{fullName}</p>
                            {employee.isFeatured && (
                              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-primary-400">ID: {employee.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-primary-300">{employee.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-white">{employee.position}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-md text-xs">
                        {formatDepartmentName(employee.department)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(employee.status)}`}>
                        {formatStatusName(employee.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-primary-300">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.performanceRating ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= employee.performanceRating!
                                    ? 'text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-primary-300">
                            {employee.performanceRating}/5
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-primary-500">Not rated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.salary ? (
                        <div className="text-sm">
                          <span className="text-white font-medium">
                            ${employee.salary.toLocaleString()}
                          </span>
                          {employee.salaryDetails?.currency && employee.salaryDetails.currency !== 'USD' && (
                            <span className="text-xs text-primary-400 ml-1">
                              {employee.salaryDetails.currency}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-primary-500">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {(employee.projects?.length || 0) > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">
                              {employee.projects?.length}
                            </span>
                            <span className="text-xs text-primary-400">
                              project{(employee.projects?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-primary-500">No projects</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {(employee.technologySkills || []).slice(0, 2).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded-md"
                          >
                            {tech.technology?.name || 'Unknown'}
                          </span>
                        ))}
                        {(employee.technologySkills || []).length > 2 && (
                          <span className="px-2 py-1 bg-dark-700/50 text-primary-400 text-xs rounded-md">
                            +{(employee.technologySkills || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <EnhancedButton
                          variant="secondary"
                          size="sm"
                          onClick={() => onView(employee)}
                          className="p-2"
                        >
                          <FiEye className="w-4 h-4" />
                        </EnhancedButton>
                        <EnhancedButton
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(employee)}
                          className="p-2"
                        >
                          <FiEdit className="w-4 h-4" />
                        </EnhancedButton>
                        <EnhancedButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            console.log('🗑️ Delete button clicked in EmployeeTable');
                            console.log('🗑️ Employee object being passed:', employee);
                            console.log('🗑️ Employee _id:', employee._id);
                            console.log('🗑️ Employee keys:', Object.keys(employee));
                            onDelete(employee);
                          }}
                          className="p-2 bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </EnhancedButton>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

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
