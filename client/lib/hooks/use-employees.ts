
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { employeesApi } from '@/lib/api/admin/employees';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  EmployeeFilters
} from '@/lib/types/employee';

// Query Keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  stats: () => [...employeeKeys.all, 'stats'] as const,
  departments: () => [...employeeKeys.all, 'departments'] as const,
  featured: (limit: number) => [...employeeKeys.all, 'featured', limit] as const,
  byManager: (managerId: string) => [...employeeKeys.all, 'manager', managerId] as const,
  byUserId: (userId: string) => [...employeeKeys.all, 'user', userId] as const,
  byEmployeeId: (employeeId: string) => [...employeeKeys.all, 'employeeId', employeeId] as const,
  byEmail: (email: string) => [...employeeKeys.all, 'email', email] as const,
};

// Hooks for queries
export const useEmployees = (filters: EmployeeFilters = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  });
};

export const useEmployeeByUserId = (userId: string) => {
  return useQuery({
    queryKey: employeeKeys.byUserId(userId),
    queryFn: () => employeesApi.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useEmployeeByEmployeeId = (employeeId: string) => {
  return useQuery({
    queryKey: employeeKeys.byEmployeeId(employeeId),
    queryFn: () => employeesApi.getByEmployeeId(employeeId),
    enabled: !!employeeId,
  });
};

export const useEmployeeByEmail = (email: string) => {
  return useQuery({
    queryKey: employeeKeys.byEmail(email),
    queryFn: () => employeesApi.getByEmail(email),
    enabled: !!email,
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: employeeKeys.stats(),
    queryFn: employeesApi.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmployeeDepartmentStats = () => {
  return useQuery({
    queryKey: employeeKeys.departments(),
    queryFn: employeesApi.getDepartmentStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedEmployees = (limit: number = 10) => {
  return useQuery({
    queryKey: employeeKeys.featured(limit),
    queryFn: () => employeesApi.getFeatured(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmployeesByManager = (managerId: string) => {
  return useQuery({
    queryKey: employeeKeys.byManager(managerId),
    queryFn: () => employeesApi.getByManager(managerId),
    enabled: !!managerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hooks for mutations
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeData) => employeesApi.create(data),
    onSuccess: (newEmployee) => {
      // Invalidate and refetch employee lists
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.departments() });
      
      toast.success('Employee created successfully!');
    },
    onError: (error: any) => {
      console.group('🔴 Employee Creation Error');
      console.log('Raw Error:', error);
      console.log('Error Response:', error?.response);
      console.log('Error Data:', error?.response?.data);
      console.log('Nested Error:', error?.response?.data?.error);
      console.groupEnd();

      const message = extractErrorMessage(error, 'Failed to create employee');

      // Log the extracted message for debugging
      console.log('📝 Extracted Error Message:', message);

      toast.error(message);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeData }) => 
      employeesApi.update(id, data),
    onSuccess: (updatedEmployee) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee._id),
        updatedEmployee
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.departments() });
      
      toast.success('Employee updated successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to update employee');
      toast.error(message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('🔥 useDeleteEmployee: Starting delete for ID:', id);
      console.log('🔥 useDeleteEmployee: Calling employeesApi.delete...');
      return employeesApi.delete(id);
    },
    onMutate: (id: string) => {
      console.log('🔥 useDeleteEmployee: onMutate called for ID:', id);
    },
    onSuccess: async (data, variables) => {
      console.log('🔥 useDeleteEmployee: Delete successful for ID:', variables);
      console.log('🔥 useDeleteEmployee: Response data:', data);

      // Invalidate all employee-related queries to force refetch
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      console.log('🔥 useDeleteEmployee: All queries invalidated');

      // Force refetch all employee queries to get updated data
      await queryClient.refetchQueries({ queryKey: employeeKeys.all });
      console.log('🔥 useDeleteEmployee: All queries refetched');

      // Also remove from cache to ensure immediate UI update
      queryClient.removeQueries({ queryKey: employeeKeys.detail(variables) });
      console.log('🔥 useDeleteEmployee: Removed deleted employee from cache');

      toast.success('Employee permanently deleted from database!');
    },
    onError: (error: any, variables) => {
      console.error('🔥 useDeleteEmployee: Delete failed for ID:', variables);
      console.error('🔥 useDeleteEmployee: Error details:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        config: error?.config
      });

      const message = extractErrorMessage(error, 'Failed to delete employee');
      toast.error(message);
    },
    onSettled: (data, error, variables) => {
      console.log('🔥 useDeleteEmployee: onSettled called for ID:', variables);
      console.log('🔥 useDeleteEmployee: Final data:', data);
      console.log('🔥 useDeleteEmployee: Final error:', error);
    }
  });
};

export const useUploadEmployeeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => 
      employeesApi.uploadImage(id, file),
    onSuccess: (response) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(response.employee._id),
        response.employee
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast.success('Profile image uploaded successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to upload image');
      toast.error(message);
    },
  });
};

export const useAssignTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      employeeId, 
      technologyId, 
      proficiencyLevel 
    }: { 
      employeeId: string; 
      technologyId: string; 
      proficiencyLevel?: number; 
    }) => employeesApi.assignTechnology(employeeId, { technologyId, proficiencyLevel: proficiencyLevel || 0 }),
    onSuccess: (updatedEmployee) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee._id),
        updatedEmployee
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast.success('Technology assigned successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to assign technology');
      toast.error(message);
    },
  });
};

export const useRemoveTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, technologyId }: { employeeId: string; technologyId: string }) => 
      employeesApi.removeTechnology(employeeId, technologyId),
    onSuccess: (updatedEmployee) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee._id),
        updatedEmployee
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast.success('Technology removed successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to remove technology');
      toast.error(message);
    },
  });
};

export const useUpdateTechnologyProficiency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      employeeId, 
      technologyId, 
      proficiencyLevel 
    }: { 
      employeeId: string; 
      technologyId: string; 
      proficiencyLevel: number; 
    }) => employeesApi.updateTechnologyProficiency(employeeId, technologyId, { proficiencyLevel }),
    onSuccess: (updatedEmployee) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee._id),
        updatedEmployee
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast.success('Technology proficiency updated successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to update proficiency');
      toast.error(message);
    },
  });
};

export const useLinkUserToEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, userId }: { employeeId: string; userId: string }) => 
      employeesApi.linkUser(employeeId, { userId }),
    onSuccess: (updatedEmployee) => {
      // Update the specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee._id),
        updatedEmployee
      );
      
      // Invalidate all employee-related queries
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      
      toast.success('User linked to employee successfully!');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error, 'Failed to link user');
      toast.error(message);
    },
  });
};
