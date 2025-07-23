'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiUsers,
  FiBarChart
} from 'react-icons/fi';
import { useEmployees, useDeleteEmployee, useUpdateEmployee } from '@/lib/hooks/use-employees';
import { EmployeeFilters, Employee, EmployeeStatus } from '@/lib/types/employee';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import Link from 'next/link';

// Component imports
import { EmployeeGrid } from './components/EmployeeGrid';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeFiltersPanel } from './components/EmployeeFiltersPanel';
import { EmployeeStats } from './components/EmployeeStats';
import { EmployeeModal } from './components/EmployeeModal';
import { BulkActionsBar } from './components/BulkActionsBar';
import { EmployeeAnalyticsDashboard } from './components/EmployeeAnalyticsDashboard';

type ViewMode = 'grid' | 'table' | 'analytics';

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Simplified delete state - just store the employee to delete
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    limit: 10,
    search: '',
    department: undefined,
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const router = useRouter();
  const { data: employeesData, isLoading, error, refetch } = useEmployees(filters);
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      department: undefined,
      status: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query });
  };

  const handleEmployeeSelect = (employeeId: string, selected: boolean) => {
    setSelectedEmployees(prev => 
      selected 
        ? [...prev, employeeId]
        : prev.filter(id => id !== employeeId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && employeesData?.employees) {
      setSelectedEmployees(employeesData.employees.map(emp => emp._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleEmployeeView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleEmployeeEdit = (employee: Employee) => {
    const employeeId = employee._id || (employee as any).id;
    console.log('🔥 Edit button clicked for employee:', employee.firstName, employee.lastName);
    console.log('🔥 Employee _id:', employee._id);
    console.log('🔥 Employee id:', (employee as any).id);
    console.log('🔥 Resolved employee ID:', employeeId);

    if (employeeId) {
      console.log('🔥 Navigating to edit page:', `/admin/employees/edit/${employeeId}`);
      router.push(`/admin/employees/edit/${employeeId}`);
    } else {
      console.error('🔥 No valid employee ID found for edit');
      toast.error('Cannot edit employee: Missing ID');
    }
  };

  const handleEmployeeDelete = (employee: Employee) => {
    console.log('🗑️ handleEmployeeDelete called for:', employee.firstName, employee.lastName);
    console.log('🗑️ Employee _id:', employee._id);
    console.log('🗑️ Employee id:', (employee as any).id);
    console.log('🗑️ Employee object keys:', Object.keys(employee));

    // Get the ID from either _id or id field (MongoDB sometimes returns id instead of _id)
    const employeeId = employee._id || (employee as any).id;
    console.log('🗑️ Resolved employee ID:', employeeId);
    console.log('🗑️ Employee ID type:', typeof employeeId);

    // Validate employee has required ID
    if (!employeeId) {
      console.error('🗑️ ERROR: Employee missing both _id and id fields!');
      toast.error('Cannot delete employee: Missing ID');
      return;
    }

    if (typeof employeeId !== 'string' || employeeId.length === 0) {
      console.error('🗑️ ERROR: Employee ID is not a valid string!');
      console.error('🗑️ ID value:', employeeId);
      toast.error('Cannot delete employee: Invalid ID');
      return;
    }

    // Create a normalized employee object with _id field for consistency
    const normalizedEmployee = {
      ...employee,
      _id: employeeId
    };

    // Store the normalized employee to delete and open dialog
    setEmployeeToDelete(normalizedEmployee);
    setIsDeleteDialogOpen(true);

    console.log('🗑️ Delete dialog opened for employee:', normalizedEmployee);
    console.log('🗑️ Normalized employee ID:', normalizedEmployee._id);
  };

  // Test function to verify delete API works directly
  const testDeleteEmployee = async () => {
    if (employees.length > 0) {
      const testEmployee = employees[0];
      if (testEmployee) {
        console.log('🧪 Testing delete for employee:', testEmployee.firstName, testEmployee.lastName);
        try {
          await deleteEmployeeMutation.mutateAsync(testEmployee._id);
          console.log('🧪 Test delete successful!');
        } catch (error) {
          console.error('🧪 Test delete failed:', error);
        }
      }
    } else {
      console.log('🧪 No employees available for testing');
    }
  };

  // Bulk operations handlers
  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedEmployees.length} employee(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      console.log('🔥 Starting bulk delete for employees:', selectedEmployees);

      // Delete employees one by one (could be optimized with a bulk delete API)
      for (const employeeId of selectedEmployees) {
        await deleteEmployeeMutation.mutateAsync(employeeId);
      }

      setSelectedEmployees([]);
      toast.success(`Successfully deleted ${selectedEmployees.length} employee(s)`);
    } catch (error) {
      console.error('🔥 Bulk delete failed:', error);
      toast.error('Failed to delete some employees');
    }
  };

  const handleBulkStatusChange = async (status: EmployeeStatus) => {
    if (selectedEmployees.length === 0) return;

    try {
      console.log('🔥 Starting bulk status change for employees:', selectedEmployees, 'to status:', status);

      // Update employees one by one (could be optimized with a bulk update API)
      for (const employeeId of selectedEmployees) {
        const employee = employees.find(emp => emp._id === employeeId);
        if (employee) {
          await updateEmployeeMutation.mutateAsync({
            id: employeeId,
            data: { status }
          });
        }
      }

      setSelectedEmployees([]);
      toast.success(`Successfully updated status for ${selectedEmployees.length} employee(s)`);
    } catch (error) {
      console.error('🔥 Bulk status change failed:', error);
      toast.error('Failed to update status for some employees');
    }
  };

  const handleBulkExport = () => {
    if (selectedEmployees.length === 0) return;

    const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp._id));
    const csvContent = generateEmployeeCSV(selectedEmployeeData);
    downloadCSV(csvContent, `employees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${selectedEmployees.length} employee(s) to CSV`);
  };

  // Helper functions for CSV export
  const generateEmployeeCSV = (employeeData: Employee[]) => {
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department',
      'Position', 'Status', 'Employment Type', 'Hire Date'
    ];

    const rows = employeeData.map(emp => [
      emp._id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.phone || '',
      emp.department,
      emp.position,
      emp.status,
      emp.employmentType,
      emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    updateFilters({ limit, page: 1 });
  };

  const handleRefresh = () => {
    refetch();
  };

  const employees = employeesData?.employees || [];
  const currentPage = employeesData?.page || 1;
  const totalPages = employeesData?.totalPages || 1;

  // Debug: Log employee data structure
  React.useEffect(() => {
    if (employees.length > 0 && employees[0]) {
      const firstEmployee = employees[0];
      console.log('🔍 EMPLOYEE DATA DEBUG:');
      console.log('🔍 First employee data structure:', firstEmployee);
      console.log('🔍 First employee _id:', firstEmployee._id);
      console.log('🔍 First employee id:', (firstEmployee as any).id);
      console.log('🔍 First employee keys:', Object.keys(firstEmployee));
      console.log('🔍 Type of _id:', typeof firstEmployee._id);
      console.log('🔍 _id length:', firstEmployee._id?.length);
      console.log('🔍 All employees count:', employees.length);

      // Check all employees for _id field
      const employeesWithoutId = employees.filter(emp => !emp._id);
      const employeesWithId = employees.filter(emp => emp._id);
      console.log('🔍 Employees with _id:', employeesWithId.length);
      console.log('🔍 Employees without _id:', employeesWithoutId.length);

      if (employeesWithoutId.length > 0) {
        console.log('🔍 First employee without _id:', employeesWithoutId[0]);
      }
    }
  }, [employees]);

  // Debug dialog state
  console.log('🔴 Current dialog state:', {
    isOpen: isDeleteDialogOpen,
    employeeToDelete: employeeToDelete,
    employeeName: employeeToDelete ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}` : 'None',
    isLoading: deleteEmployeeMutation.isPending
  });

  // Test function to verify mutation works
  const testDeleteMutation = async () => {
    console.log('🧪 Testing delete mutation...');
    console.log('🧪 deleteEmployeeMutation:', deleteEmployeeMutation);
    console.log('🧪 Available employees:', employees.map(e => ({ id: e._id, name: `${e.firstName} ${e.lastName}` })));

    if (employees.length > 0) {
      const testEmployee = employees[0];
      if (testEmployee && testEmployee._id) {
        console.log('🧪 Testing with first employee:', testEmployee._id);

        try {
          await deleteEmployeeMutation.mutateAsync(testEmployee._id);
          console.log('🧪 Test delete successful!');
        } catch (error) {
          console.error('🧪 Test delete failed:', error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple p-3 shadow-glow">
              <FiUsers className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Employee Management</h1>
              <p className="mt-1 text-sm text-primary-300 sm:text-base">Manage your team members and their information</p>
            </div>
          </div>

          <Link href="/admin/employees/create">
            <EnhancedButton
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-accent-purple transition-all duration-300 hover:from-primary-600 hover:to-accent-purple/90 hover:shadow-glow"
            >
              <FiPlus className="mr-2 size-5" />
              Add Employee
            </EnhancedButton>
          </Link>
        </motion.div>

        {/* Statistics */}
        <EmployeeStats />

        {/* Search and Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, position, or employee ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <EnhancedButton
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary-500/20 border-primary-500' : ''}
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
              </EnhancedButton>

              <EnhancedButton
                variant="secondary"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </EnhancedButton>

              {/* View Mode Toggle */}
              <div className="flex bg-dark-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-primary-300 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-primary-500 text-white'
                      : 'text-primary-300 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'analytics'
                      ? 'bg-primary-500 text-white'
                      : 'text-primary-300 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  <FiBarChart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-dark-600 mt-6">
                  <EmployeeFiltersPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onReset={resetFilters}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedEmployees.length}
            onClearSelection={() => setSelectedEmployees([])}
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkExport={handleBulkExport}
          />
        )}

        {/* Content */}
        <div className="space-y-6">
          {error ? (
            <GlassCard className="p-8 text-center">
              <div className="text-red-400 mb-4">
                <p className="text-lg font-semibold">Error loading employees</p>
                <p className="text-sm text-primary-300 mt-2">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </div>
              <EnhancedButton onClick={handleRefresh} variant="primary">
                Try Again
              </EnhancedButton>
            </GlassCard>
          ) : viewMode === 'analytics' ? (
            <EmployeeAnalyticsDashboard employees={employees} />
          ) : viewMode === 'grid' ? (
            <EmployeeGrid
              employees={employees}
              isLoading={isLoading}
              selectedIds={selectedEmployees}
              onSelect={handleEmployeeSelect}
              onSelectAll={handleSelectAll}
              onView={handleEmployeeView}
              onEdit={handleEmployeeEdit}
              onDelete={handleEmployeeDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={filters.limit || 10}
              onLimitChange={handleLimitChange}
            />
          ) : (
            <EmployeeTable
              employees={employees}
              isLoading={isLoading}
              selectedIds={selectedEmployees}
              onSelect={handleEmployeeSelect}
              onSelectAll={handleSelectAll}
              onView={handleEmployeeView}
              onEdit={handleEmployeeEdit}
              onDelete={handleEmployeeDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={filters.limit || 10}
              onLimitChange={handleLimitChange}
              sortBy={filters.sortBy || 'createdAt'}
              sortOrder={filters.sortOrder || 'desc'}
              onSort={(field, order) => updateFilters({ sortBy: field, sortOrder: order })}
            />
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
      />

      {/* Test Delete Button - Remove this after testing */}
      <button
        onClick={testDeleteEmployee}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
        disabled={deleteEmployeeMutation.isPending || employees.length === 0}
      >
        🧪 Test Delete API
      </button>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          console.log('🔴 ConfirmationDialog onClose called');
          setIsDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={async () => {
          console.log('🔴 ConfirmationDialog onConfirm called');
          console.log('🔴 employeeToDelete state:', employeeToDelete);
          console.log('🔴 employeeToDelete._id:', employeeToDelete?._id);
          console.log('🔴 isDeleteDialogOpen:', isDeleteDialogOpen);

          // Validate we have an employee to delete
          if (!employeeToDelete) {
            console.error('🔥 No employee selected for deletion');
            setIsDeleteDialogOpen(false);
            return;
          }

          // Get the ID (should be normalized to _id by handleEmployeeDelete)
          const employeeId = employeeToDelete._id || (employeeToDelete as any).id;
          console.log('🔴 Resolved employee ID for deletion:', employeeId);

          if (!employeeId) {
            console.error('🔥 Employee missing ID field');
            console.error('🔥 Employee object:', employeeToDelete);
            console.error('🔥 Employee keys:', Object.keys(employeeToDelete));
            setIsDeleteDialogOpen(false);
            setEmployeeToDelete(null);
            return;
          }

          if (typeof employeeId !== 'string' || employeeId.trim() === '') {
            console.error('🔥 Employee ID is not a valid string');
            console.error('🔥 ID value:', employeeId);
            console.error('🔥 ID type:', typeof employeeId);
            setIsDeleteDialogOpen(false);
            setEmployeeToDelete(null);
            return;
          }

          try {
            console.log('🔥 Starting delete process...');
            console.log('🔥 Employee ID:', employeeId);
            console.log('🔥 Employee name:', `${employeeToDelete.firstName} ${employeeToDelete.lastName}`);

            // Call the delete mutation and wait for completion
            const result = await deleteEmployeeMutation.mutateAsync(employeeId);

            console.log('🔥 Delete mutation completed successfully');
            console.log('🔥 Delete result:', result);

            // Close the dialog after successful deletion
            setIsDeleteDialogOpen(false);
            setEmployeeToDelete(null);

            console.log('🔥 Delete process completed successfully');

          } catch (error: any) {
            console.error('🔥 Delete operation failed:', error);
            console.error('🔥 Error details:', {
              message: error?.message,
              status: error?.response?.status,
              data: error?.response?.data
            });

            // Close dialog even on error since the mutation hook handles error display
            setIsDeleteDialogOpen(false);
            setEmployeeToDelete(null);
          }
        }}
        title="Delete Employee"
        message={employeeToDelete ? `Are you sure you want to delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}? This action cannot be undone.` : 'Are you sure you want to delete this employee?'}
        confirmText="Delete Employee"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteEmployeeMutation.isPending}
      />

      {/* Test Delete Button - Remove after debugging */}
      <div className="fixed bottom-4 right-4 z-50">
        <EnhancedButton
          onClick={testDeleteMutation}
          variant="primary"
          className="bg-red-600 hover:bg-red-700"
        >
          🧪 Test Delete Mutation
        </EnhancedButton>
      </div>
    </div>
  );
}
