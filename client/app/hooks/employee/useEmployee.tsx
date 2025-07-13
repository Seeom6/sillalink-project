"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { empApi } from "@/app/api/employee/employee.api"
import { createEmpPayload } from "@/app/api/employee/emp-api-type"
import { useToast } from "@/app/hooks/useToast"
import { HandleError } from "@/app/lib/ErrorEradication"
import type { Employee, EmployeeFilters, EmployeesResponse } from "@/app/types/employeeTypes"

// Real API function for fetching employees
const fetchEmployees = async (filters: EmployeeFilters): Promise<EmployeesResponse> => {
  try {
    const response = await empApi.getEmp();

    if (process.env.NODE_ENV === 'development') {
      console.log('[useEmployee] Raw API response:', response);
    }

    // Handle different response structures
    let employees: any[] = [];

    if (response && response.data && Array.isArray(response.data)) {
      // Response format: {data: Array(15)}
      employees = response.data;
      if (process.env.NODE_ENV === 'development') {
        console.log('[useEmployee] Found data property with array:', employees.length, 'employees');
      }
    } else if (Array.isArray(response)) {
      // Direct array response
      employees = response;
      if (process.env.NODE_ENV === 'development') {
        console.log('[useEmployee] Direct array response:', employees.length, 'employees');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useEmployee] Unknown response format:', response);
      }
      employees = [];
    }

    // Apply filters if needed
    let filteredEmployees: any[] = employees;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredEmployees = employees.filter((emp: any) =>
        emp.firstName?.toLowerCase().includes(searchTerm) ||
        emp.lastName?.toLowerCase().includes(searchTerm) ||
        emp.email?.toLowerCase().includes(searchTerm) ||
        emp.name?.toLowerCase().includes(searchTerm) ||
        emp.role?.toLowerCase().includes(searchTerm) ||
        emp.position?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filteredEmployees = filteredEmployees.filter((emp: any) => {
        if (filters.status === 'active') {
          return emp.isActive === true || emp.employmentStatus === 'active';
        } else if (filters.status === 'inactive') {
          return emp.isActive === false || emp.employmentStatus === 'inactive';
        }
        return emp.employmentStatus === filters.status;
      });
    }

    // Transform to frontend format matching Employee interface
    const transformedEmployees: Employee[] = filteredEmployees.map((emp: any): Employee => {
      const isActive = emp.isActive !== undefined ? emp.isActive : true;
      const dateValue = emp.startDate || emp.hireDate;

      const employee: Employee = {
        id: emp._id || emp.id,
        _id: emp._id,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        email: emp.email || '',
        role: emp.role || 'user',
        isActive: isActive,
        name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'N/A',
        username: `@${emp.firstName?.toLowerCase() || 'user'}`,
        phone: emp.phone,
        position: emp.position || emp.employee?.position,
        status: isActive ? "Active" as const : "Offline" as const,
        avatar: emp.image || emp.avatar,
        image: emp.image,
        startDate: emp.startDate,
        hireDate: emp.hireDate,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
        employee: emp.employee
      };

      // Only add date if it exists
      if (dateValue) {
        employee.date = new Date(dateValue).toLocaleDateString();
      }

      return employee;
    });

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedData = transformedEmployees.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: transformedEmployees.length,
      page: filters.page,
      limit: filters.limit,
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Return empty result on error
    return {
      data: [],
      total: 0,
      page: filters.page,
      limit: filters.limit,
    };
  }
};

export const useGetEmployees = (filters: EmployeeFilters) => {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: () => fetchEmployees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAddEmployee = () => {
  const toast = useToast()
  return useMutation({
    mutationFn: (payload: createEmpPayload) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAddEmployee] Starting mutation with payload:', payload);
      }
      return empApi.createEmp(payload);
    },
    onSuccess: (data: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAddEmployee] Success callback triggered:', data);
      }
      toast.success("Success!", "Employee created successfully")
    },
    onError: (err: any) => {
      console.error('[useAddEmployee] Error callback triggered:', err);
      toast.error("Error", HandleError(err))
    }
  })
}

// Mock hooks for projects and managers (until real implementations are available)
export const useGetProjects = (): Array<{ id: string; name: string }> => ([
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Project Beta' }
]);

export const useGetManagers = (): Array<{ id: string; name: string }> => ([
  { id: '1', name: 'John Manager' },
  { id: '2', name: 'Jane Supervisor' }
]);
