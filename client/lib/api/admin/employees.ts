import apiClient from '../client';
import {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  EmployeeFilters,
  EmployeeListResponse,
  EmployeeStats,
  EmployeeDepartment,
  EmployeeStatus,
  PerformanceReview,
  EmployeeProject,
  Training,
  Achievement,
  DisciplinaryAction
} from '@/lib/types/employee';

// API-specific interfaces
interface SearchOptions {
  query: string;
  limit?: number;
}

interface FileUploadResponse {
  message: string;
  imageUrl: string;
  employee: Employee;
}

interface TechnologyAssignmentData {
  technologyId: string;
  proficiencyLevel?: number;
}

interface TechnologyProficiencyData {
  proficiencyLevel: number;
}

interface UserLinkData {
  userId: string;
}

interface AttendanceData {
  totalDays?: number;
  presentDays?: number;
  absentDays?: number;
  lateDays?: number;
  overtimeHours?: number;
}

const BASE_URL = '/admin/employees';

export const employeesApi = {
  // ===== BASIC CRUD OPERATIONS =====

  // Create new employee
  create: async (data: CreateEmployeeData): Promise<Employee> => {
    console.log('🔥 employeesApi.create: Creating employee with data:', data);
    try {
      const response = await apiClient.post(BASE_URL, data);
      console.log('🔥 employeesApi.create: Raw response:', response.data);

      const actualData = response.data.data || response.data;
      console.log('🔥 employeesApi.create: Employee created successfully:', actualData);
      return actualData;
    } catch (error) {
      console.error('🔥 employeesApi.create: Failed to create employee:', error);
      throw error;
    }
  },

  // Get all employees with filters and pagination
  getAll: async (filters: EmployeeFilters = {}): Promise<EmployeeListResponse> => {
    console.log('🔥 employeesApi.getAll: Starting request with filters:', filters);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    try {
      const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
      console.log('🔥 employeesApi.getAll: Raw response:', response);
      console.log('🔥 employeesApi.getAll: Response data:', response.data);
      console.log('🔥 employeesApi.getAll: Response data.data:', response.data.data);

      // The API client wraps responses in { success, data, message }
      // So we need to return response.data.data to get the actual employee data
      const actualData = response.data.data || response.data;
      console.log('🔥 employeesApi.getAll: Actual employee data:', actualData);

      // Verify first employee has _id field
      if (actualData?.employees?.length > 0) {
        const firstEmployee = actualData.employees[0];
        console.log('🔥 employeesApi.getAll: First employee _id check:', firstEmployee._id);
        console.log('🔥 employeesApi.getAll: First employee keys:', Object.keys(firstEmployee));
      }

      return actualData;
    } catch (error) {
      console.error('🔥 employeesApi.getAll: Request failed:', error);
      throw error;
    }
  },

  // Get single employee by ID
  getById: async (id: string): Promise<Employee> => {
    console.log('🔥 employeesApi.getById: Fetching employee with ID:', id);
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      console.log('🔥 employeesApi.getById: Raw response:', response.data);

      const actualData = response.data.data || response.data;
      console.log('🔥 employeesApi.getById: Employee fetched successfully:', actualData);
      return actualData;
    } catch (error) {
      console.error('🔥 employeesApi.getById: Failed to fetch employee:', error);
      throw error;
    }
  },

  // Update employee
  update: async (id: string, data: UpdateEmployeeData): Promise<Employee> => {
    console.log('🔥 employeesApi.update: Starting update process');
    console.log('🔥 employeesApi.update: Employee ID:', id);
    console.log('🔥 employeesApi.update: Update data:', data);
    console.log('🔥 employeesApi.update: Data keys:', Object.keys(data));
    console.log('🔥 employeesApi.update: Request URL:', `${BASE_URL}/${id}`);

    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, data);
      console.log('🔥 employeesApi.update: Raw response received');
      console.log('🔥 employeesApi.update: Response status:', response.status);
      console.log('🔥 employeesApi.update: Response headers:', response.headers);
      console.log('🔥 employeesApi.update: Raw response data:', response.data);

      const actualData = response.data.data || response.data;
      console.log('🔥 employeesApi.update: Processed response data:', actualData);
      console.log('🔥 employeesApi.update: Updated employee ID:', actualData._id || actualData.id);
      console.log('🔥 employeesApi.update: Employee updated successfully');

      return actualData;
    } catch (error: any) {
      console.error('🔥 employeesApi.update: Update failed');
      console.error('🔥 employeesApi.update: Error:', error);
      console.error('🔥 employeesApi.update: Error message:', error?.message);
      console.error('🔥 employeesApi.update: Error response:', error?.response);
      console.error('🔥 employeesApi.update: Error response data:', error?.response?.data);
      console.error('🔥 employeesApi.update: Error response status:', error?.response?.status);
      throw error;
    }
  },

  // ===== SEARCH AND LOOKUP OPERATIONS =====

  // Search employees by term
  search: async (term: string, limit: number = 10): Promise<Employee[]> => {
    console.log('🔥 employeesApi.search: Searching for term:', term, 'with limit:', limit);
    try {
      const response = await apiClient.get(`${BASE_URL}/search/${encodeURIComponent(term)}?limit=${limit}`);
      console.log('🔥 employeesApi.search: Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.search: Search failed:', error);
      throw error;
    }
  },

  // Get employees by manager
  getByManager: async (managerId: string): Promise<Employee[]> => {
    console.log('🔥 employeesApi.getByManager: Fetching employees for manager:', managerId);
    try {
      const response = await apiClient.get(`${BASE_URL}/manager/${managerId}`);
      console.log('🔥 employeesApi.getByManager: Employees fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.getByManager: Failed to fetch employees by manager:', error);
      throw error;
    }
  },

  // Get employee by employee ID
  getByEmployeeId: async (employeeId: string): Promise<Employee> => {
    console.log('🔥 employeesApi.getByEmployeeId: Fetching employee with employee ID:', employeeId);
    try {
      const response = await apiClient.get(`${BASE_URL}/employee-id/${employeeId}`);
      console.log('🔥 employeesApi.getByEmployeeId: Employee fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.getByEmployeeId: Failed to fetch employee by employee ID:', error);
      throw error;
    }
  },

  // Get employee by email
  getByEmail: async (email: string): Promise<Employee> => {
    console.log('🔥 employeesApi.getByEmail: Fetching employee with email:', email);
    try {
      const response = await apiClient.get(`${BASE_URL}/email/${email}`);
      console.log('🔥 employeesApi.getByEmail: Employee fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.getByEmail: Failed to fetch employee by email:', error);
      throw error;
    }
  },

  // Get employee by user ID
  getByUserId: async (userId: string): Promise<Employee | null> => {
    console.log('🔥 employeesApi.getByUserId: Fetching employee with user ID:', userId);
    try {
      const response = await apiClient.get(`${BASE_URL}/user/${userId}`);
      console.log('🔥 employeesApi.getByUserId: Employee fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('🔥 employeesApi.getByUserId: No employee found for user ID:', userId);
        return null;
      }
      console.error('🔥 employeesApi.getByUserId: Failed to fetch employee by user ID:', error);
      throw error;
    }
  },

  // Create new employee
  create: async (data: CreateEmployeeData): Promise<Employee> => {
    try {
      console.log('Creating employee with data:', data);
      const response = await apiClient.post(BASE_URL, data);
      console.log('Employee creation response:', response);
      return response.data;
    } catch (error) {
      console.error('Employee creation failed in API layer:', error);
      throw error; // Re-throw to let the hook handle it
    }
  },

  // Update employee
  update: async (id: string, data: UpdateEmployeeData): Promise<Employee> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete employee (hard delete)
  delete: async (id: string): Promise<void> => {
    console.log('🔥 employeesApi.delete: Starting delete for ID:', id);
    console.log('🔥 employeesApi.delete: Request URL:', `${BASE_URL}/${id}`);

    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      console.log('🔥 employeesApi.delete: Delete successful, response:', response);
      // For delete operations, we don't need to return data
      return;
    } catch (error) {
      console.error('🔥 employeesApi.delete: Delete failed:', error);
      throw error;
    }
  },

  // Soft delete employee (mark as deleted but keep in database)
  softDelete: async (id: string): Promise<void> => {
    console.log('🔥 employeesApi.softDelete: Starting soft delete for ID:', id);
    console.log('🔥 employeesApi.softDelete: Request URL:', `${BASE_URL}/${id}/soft-delete`);

    try {
      const response = await apiClient.patch(`${BASE_URL}/${id}/soft-delete`);
      console.log('🔥 employeesApi.softDelete: Soft delete successful, response:', response);
      // For delete operations, we don't need to return data
      return;
    } catch (error) {
      console.error('🔥 employeesApi.softDelete: Soft delete failed:', error);
      throw error;
    }
  },

  // Bulk delete employees
  bulkDelete: async (data: BulkDeleteData): Promise<void> => {
    await apiClient.post(`${BASE_URL}/bulk-delete`, data);
  },

  // Bulk update employees
  bulkUpdate: async (data: BulkUpdateData): Promise<void> => {
    await apiClient.put(`${BASE_URL}/bulk-update`, data);
  },

  // Upload employee profile image
  uploadImage: async (id: string, file: File): Promise<FileUploadResponse> => {
    console.log('🔥 employeesApi.uploadImage: Starting upload for employee ID:', id);
    console.log('🔥 employeesApi.uploadImage: File:', file.name, file.size, 'bytes');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`${BASE_URL}/${id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('🔥 employeesApi.uploadImage: Raw response:', response.data);

      // Handle the API client response wrapping
      const actualData = response.data.data || response.data;
      console.log('🔥 employeesApi.uploadImage: Upload successful:', actualData);

      return actualData;
    } catch (error) {
      console.error('🔥 employeesApi.uploadImage: Upload failed:', error);
      throw error;
    }
  },

  // Get employee statistics
  getStats: async (): Promise<EmployeeStats> => {
    const response = await apiClient.get(`${BASE_URL}/stats/overview`);
    return response.data;
  },

  // Search employees
  search: async (options: SearchOptions): Promise<Employee[]> => {
    const { query, limit = 10 } = options;
    const response = await apiClient.get(`${BASE_URL}/search/${encodeURIComponent(query)}?limit=${limit}`);
    return response.data;
  },

  // Get featured employees
  getFeatured: async (limit: number = 10): Promise<Employee[]> => {
    const response = await apiClient.get(`${BASE_URL}/featured/list?limit=${limit}`);
    return response.data;
  },

  // Get employees by department
  getDepartmentStats: async (): Promise<any[]> => {
    const response = await apiClient.get(`${BASE_URL}/department/stats`);
    return response.data;
  },

  // Get employees by manager
  getByManager: async (managerId: string): Promise<Employee[]> => {
    const response = await apiClient.get(`${BASE_URL}/manager/${managerId}`);
    return response.data;
  },

  // Assign technology to employee
  assignTechnology: async (id: string, data: TechnologyAssignmentData): Promise<Employee> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/technologies`, data);
    return response.data;
  },

  // Remove technology from employee
  removeTechnology: async (id: string, technologyId: string): Promise<Employee> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}/technologies/${technologyId}`);
    return response.data;
  },

  // Update technology proficiency for employee
  updateTechnologyProficiency: async (
    id: string, 
    technologyId: string, 
    data: TechnologyProficiencyData
  ): Promise<Employee> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/technologies/${technologyId}/proficiency`, data);
    return response.data;
  },

  // Link user to employee
  linkUser: async (id: string, data: UserLinkData): Promise<Employee> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/link-user`, data);
    return response.data;
  }
};

// Enhanced employeesApi with new methods
const enhancedEmployeesApi = {
  ...employeesApi,

  // Performance Review Management
  addPerformanceReview: async (employeeId: string, reviewData: Omit<PerformanceReview, '_id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await apiClient.post(`/admin/employees/${employeeId}/performance-reviews`, reviewData);
    return response.data;
  },

  updatePerformanceReview: async (employeeId: string, reviewId: string, reviewData: Partial<PerformanceReview>): Promise<Employee> => {
    const response = await apiClient.put(`/admin/employees/${employeeId}/performance-reviews/${reviewId}`, reviewData);
    return response.data;
  },

  removePerformanceReview: async (employeeId: string, reviewId: string): Promise<Employee> => {
    const response = await apiClient.delete(`/admin/employees/${employeeId}/performance-reviews/${reviewId}`);
    return response.data;
  },

  // Project Management
  addProject: async (employeeId: string, projectData: Omit<EmployeeProject, '_id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await apiClient.post(`/admin/employees/${employeeId}/projects`, projectData);
    return response.data;
  },

  updateProject: async (employeeId: string, projectId: string, projectData: Partial<EmployeeProject>): Promise<Employee> => {
    const response = await apiClient.put(`/admin/employees/${employeeId}/projects/${projectId}`, projectData);
    return response.data;
  },

  removeProject: async (employeeId: string, projectId: string): Promise<Employee> => {
    const response = await apiClient.delete(`/admin/employees/${employeeId}/projects/${projectId}`);
    return response.data;
  },

  // Training Management
  addTraining: async (employeeId: string, trainingData: Omit<Training, '_id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await apiClient.post(`/admin/employees/${employeeId}/trainings`, trainingData);
    return response.data;
  },

  updateTraining: async (employeeId: string, trainingId: string, trainingData: Partial<Training>): Promise<Employee> => {
    const response = await apiClient.put(`/admin/employees/${employeeId}/trainings/${trainingId}`, trainingData);
    return response.data;
  },

  removeTraining: async (employeeId: string, trainingId: string): Promise<Employee> => {
    const response = await apiClient.delete(`/admin/employees/${employeeId}/trainings/${trainingId}`);
    return response.data;
  },

  // Achievement Management
  addAchievement: async (employeeId: string, achievementData: Omit<Achievement, '_id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await apiClient.post(`/admin/employees/${employeeId}/achievements`, achievementData);
    return response.data;
  },

  updateAchievement: async (employeeId: string, achievementId: string, achievementData: Partial<Achievement>): Promise<Employee> => {
    const response = await apiClient.put(`/admin/employees/${employeeId}/achievements/${achievementId}`, achievementData);
    return response.data;
  },

  removeAchievement: async (employeeId: string, achievementId: string): Promise<Employee> => {
    const response = await apiClient.delete(`/admin/employees/${employeeId}/achievements/${achievementId}`);
    return response.data;
  },

  // Disciplinary Action Management
  addDisciplinaryAction: async (employeeId: string, actionData: Omit<DisciplinaryAction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await apiClient.post(`/admin/employees/${employeeId}/disciplinary-actions`, actionData);
    return response.data;
  },

  updateDisciplinaryAction: async (employeeId: string, actionId: string, actionData: Partial<DisciplinaryAction>): Promise<Employee> => {
    const response = await apiClient.put(`/admin/employees/${employeeId}/disciplinary-actions/${actionId}`, actionData);
    return response.data;
  },

  removeDisciplinaryAction: async (employeeId: string, actionId: string): Promise<Employee> => {
    const response = await apiClient.delete(`/admin/employees/${employeeId}/disciplinary-actions/${actionId}`);
    return response.data;
  },

  // Analytics and Reporting
  getEmployeeAnalytics: async (employeeId: string): Promise<any> => {
    const response = await apiClient.get(`/admin/employees/${employeeId}/analytics`);
    return response.data;
  },

  generateEmployeeReport: async (employeeId: string): Promise<any> => {
    const response = await apiClient.get(`/admin/employees/${employeeId}/report`);
    return response.data;
  },

  // Attendance Management
  updateAttendance: async (employeeId: string, attendanceData: AttendanceData): Promise<Employee> => {
    console.log('🔥 employeesApi.updateAttendance: Updating attendance for employee:', employeeId);
    try {
      const response = await apiClient.put(`${BASE_URL}/${employeeId}/attendance`, attendanceData);
      console.log('🔥 employeesApi.updateAttendance: Attendance updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.updateAttendance: Failed to update attendance:', error);
      throw error;
    }
  },

  // Link user to employee
  linkUser: async (employeeId: string, userData: UserLinkData): Promise<Employee> => {
    console.log('🔥 employeesApi.linkUser: Linking user to employee:', employeeId, userData);
    try {
      const response = await apiClient.put(`${BASE_URL}/${employeeId}/link-user`, userData);
      console.log('🔥 employeesApi.linkUser: User linked successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔥 employeesApi.linkUser: Failed to link user:', error);
      throw error;
    }
  }
};
