"use client"

import React, { useState, useCallback, useMemo, useEffect, memo, useRef } from "react"
import { MoreHorizontal, Info, Trash2 } from "lucide-react"

import { empApi } from "@/app/api/employee/employee.api"
import { Employee } from "@/app/types/employeeTypes"
import { EmployeeAvatar } from "./employeeAvatar"
import { StatusBadge, RoleBadge } from "./employeeBadge"
import { EmptyState } from "./employeeStatus"
import { TableFilters } from "./tableFilter"
import { TablePagination } from "./tablePagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/ui/table"
import { Checkbox } from "@/app/shared/ui/checkbox"
import Button from "@/app/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"
import { Badge } from "@/app/shared/ui/badge"

// Standardized logging utility (consistent with edit/create pages)
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EmployeesTable] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[EmployeesTable] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[EmployeesTable] ${message}`, data);
    }
  }
};

// Enhanced error handling utility (consistent with edit/create pages)
const handleApiError = (error: any): string => {
  logger.error('API Error occurred', error);

  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return error.response?.data?.message || 'Invalid data provided. Please check your input.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 409:
        return error.response?.data?.message || 'This email address is already in use.';
      case 422:
        return error.response?.data?.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        break;
    }
  }

  const message =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred. Please try again.';

  return message;
};

// Standardized Employee interface for table operations
interface StandardizedEmployee {
  _id: string; // Use _id as primary identifier
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  position?: string;
  department?: string;
  hireDate?: string;
  avatar?: string;
  status: 'Active' | 'Inactive';
  employmentStatus?: string;
}

// Enhanced table configuration
interface TableConfig {
  defaultPageSize: number;
  maxPageSize: number;
  refreshInterval?: number;
  enableAutoRefresh: boolean;
}

const DEFAULT_CONFIG: TableConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  enableAutoRefresh: false,
};

// Enhanced props interface with better typing and configuration options
interface EmployeesTableProps {
  onAddUser?: () => void;
  onEditUser?: (employee: StandardizedEmployee) => void;
  onDeleteUser?: (employee: StandardizedEmployee) => void;
  onViewUser?: (employee: StandardizedEmployee) => void;
  config?: Partial<TableConfig>;
  refreshTrigger?: number; // External trigger for refreshing data
  className?: string;
}

// Enhanced employees data structure
interface EmployeesData {
  data: StandardizedEmployee[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

const EmployeesTable = memo(({
  onAddUser = () => {},
  onEditUser = () => {},
  onDeleteUser = () => {},
  onViewUser = () => {},
  config = {},
  refreshTrigger = 0,
  className = "",
}: EmployeesTableProps) => {
  logger.info('Component rendered');

  // Merge config with defaults
  const tableConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  // Component state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    limit: tableConfig.defaultPageSize,
  });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeesData, setEmployeesData] = useState<EmployeesData>({
    data: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  // Ref to track component mount status
  const isMountedRef = useRef(true);

  // Enhanced data fetching function with proper error handling
  const fetchEmployees = useCallback(async () => {
    // Check if component is still mounted
    if (!isMountedRef.current) return;

    try {
      setEmployeesData(prev => ({ ...prev, isLoading: true, error: null }));
      logger.info('Fetching employees...');

      const response = await empApi.getEmp();
      logger.info('Raw API response received', { responseType: typeof response });

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      // Handle different response structures
      let rawEmployeesData = [];

      if (response && response.data && Array.isArray(response.data)) {
        rawEmployeesData = response.data;
        logger.info('Found data property with array', { count: rawEmployeesData.length });
      } else if (Array.isArray(response)) {
        rawEmployeesData = response;
        logger.info('Direct array response', { count: rawEmployeesData.length });
      } else {
        logger.warn('Unknown response format', response);
        rawEmployeesData = [];
      }

      // Transform employees data to standardized format
      const transformedEmployees: StandardizedEmployee[] = rawEmployeesData.map((emp: any) => ({
        _id: emp._id || emp.id || '',
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'N/A',
        email: emp.email || 'N/A',
        role: emp.role || 'user',
        phone: emp.phone || 'N/A',
        isActive: emp.isActive !== undefined ? emp.isActive : true,
        position: emp.position || emp.employee?.position || 'N/A',
        department: emp.department || emp.employee?.department || 'N/A',
        hireDate: emp.hireDate || emp.startDate || emp.createdAt || null,
        avatar: emp.image || emp.avatar || "/placeholder.svg?height=40&width=40",
        status: emp.isActive ? 'Active' : 'Inactive',
        employmentStatus: emp.employmentStatus || (emp.isActive ? 'active' : 'inactive')
      }));

      logger.info('Employees transformed successfully', { count: transformedEmployees.length });

      // Update state only if component is still mounted
      if (isMountedRef.current) {
        setEmployeesData({
          data: transformedEmployees,
          total: transformedEmployees.length,
          isLoading: false,
          error: null,
        });
      }

    } catch (err: any) {
      logger.error('Error fetching employees', err);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      const errorMessage = handleApiError(err);

      if (err?.response?.status === 401) {
        // Redirect to login for authentication errors
        window.location.href = '/login';
        return;
      }

      setEmployeesData({
        data: [],
        total: 0,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, []);

  // Effect for initial data loading and refresh triggers
  useEffect(() => {
    logger.info('Initial data fetch triggered');
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  // Cleanup effect to mark component as unmounted
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Log current state for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    logger.info('Current state', {
      employeesData,
      filters,
      selectedCount: selectedEmployees.length
    });
  }

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked && employeesData.data.length > 0) {
        setSelectedEmployees(employeesData.data.map((emp) => emp._id))
      } else {
        setSelectedEmployees([])
      }
    },
    [employeesData.data],
  )

  const handleSelectEmployee = useCallback(
    (employeeId: string, checked: boolean) => {
      setSelectedEmployees((prev) =>
        checked ? [...prev, employeeId] : prev.filter((id) => id !== employeeId)
      )
    },
    [],
  )

  const isAllSelected = useMemo(() => {
    return (
      employeesData.data.length > 0 &&
      selectedEmployees.length === employeesData.data.length
    )
  }, [selectedEmployees.length, employeesData.data.length])

  const isIndeterminate = useMemo(() => {
    return (
      selectedEmployees.length > 0 &&
      selectedEmployees.length < employeesData.data.length
    )
  }, [selectedEmployees.length, employeesData.data.length])

  if (employeesData.error) {
    if ((employeesData.error as any)?.isAuthError || (employeesData.error as any)?.loginRequired) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zM12 9V7a4 4 0 00-8 0v2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please log in with admin credentials to view employees.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <p className="text-sm text-gray-500">
                Use: admin@sillalink.com / admin123
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading employees. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    )
  }



  return (
    <div className="w-full">

      <TableFilters
        search={filters.search}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onAddUser={onAddUser}
      />

      {employeesData.isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !employeesData.data.length ? (
        <EmptyState onAction={onAddUser} />
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected || false}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el && el.querySelector("input")) {
                          ;(el.querySelector("input") as HTMLInputElement).indeterminate =
                            isIndeterminate
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-medium">Employee</TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">Department</TableHead>
                  <TableHead className="font-medium">Position</TableHead>
                  <TableHead className="font-medium">Employment Status</TableHead>
                  <TableHead className="font-medium">Hire Date</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesData.data.map((employee: StandardizedEmployee) => {
                  const employeeId = employee._id
                  const fullName = employee.name || `${employee.firstName} ${employee.lastName}`.trim()
                  const position = employee.position || 'N/A'
                  const department = employee.department || 'N/A'
                  const employmentStatus = employee.employmentStatus || 'N/A'
                  const hireDate = employee.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString()
                    : 'N/A'
                  const status = employee.status

                  return (
                  <TableRow key={employeeId} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employeeId)}
                        onCheckedChange={(checked) =>
                          handleSelectEmployee(employeeId, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          name={fullName}
                          avatar={employee.avatar || employee?.image || employee?.employee?.image}
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                          {employee.phone && (
                            <div className="text-xs text-gray-400">
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <RoleBadge role={employee.role || 'user'} />
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge variant="outline">
                        {department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                        {position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <Badge
                        variant={employmentStatus === 'full-time' ? 'default' : 'secondary'}
                        className={
                          employmentStatus === 'full-time' ? 'bg-green-100 text-green-800' :
                          employmentStatus === 'part-time' ? 'bg-yellow-100 text-yellow-800' :
                          employmentStatus === 'contractor' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {employmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {hireDate}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status as "Active" | "Offline" | "Wait"} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewUser(employee)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewUser(employee)}>
                            <Info className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditUser(employee)}>
                            Edit Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteUser(employee)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            currentPage={filters.page}
            totalPages={Math.ceil(employeesData.total / filters.limit)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
});

// Set display name for debugging
EmployeesTable.displayName = 'EmployeesTable';

export { EmployeesTable };
