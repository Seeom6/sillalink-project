import apiClient from '../apiClient';
import {
  Project,
  ProjectFormData,
  ProjectResponse,
  ProjectsResponse,
  ProjectStatsResponse,
  ProjectQueryParams,
  BulkDeleteRequest,
  BulkUpdateStatusRequest,
  BulkOperationResponse,
  ImageUploadResponse,
  CreateProjectPayload,
  UpdateProjectPayload
} from '@/app/types/projectTypes';

// Cache for pending requests to prevent duplicates
const requestCache = new Map<string, Promise<any>>();

/**
 * Get all projects with filtering and pagination
 */
export const getProjects = async (params?: ProjectQueryParams): Promise<ProjectsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/admin/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response: ProjectsResponse = await apiClient.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single project by ID with caching
 */
export const getProject = async (id: string): Promise<ProjectResponse> => {
  const cacheKey = `project-${id}`;
  
  // Check if there's already a pending request for this ID
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  // Create new request
  const requestPromise = (async (): Promise<ProjectResponse> => {
    try {
      const response: ProjectResponse = await apiClient.get(`/admin/projects/${id}`);
      return response;
    } catch (error) {
      throw error;
    } finally {
      // Remove from cache after completion (success or failure)
      requestCache.delete(cacheKey);
    }
  })();

  // Cache the promise
  requestCache.set(cacheKey, requestPromise);
  return requestPromise;
};

/**
 * Create a new project
 */
export const createProject = async (
  data: ProjectFormData,
  imageFiles?: File[]
): Promise<ProjectResponse> => {
  try {
    // First upload images if provided
    let imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResponse = await uploadProjectImages(imageFiles);
      imageUrls = uploadResponse.imageUrls;
    }

    // Prepare project data
    const projectData: CreateProjectPayload = {
      name: data.name,
      description: data.description,
      images: [...(data.images || []), ...imageUrls],
      externalLink: data.externalLink,
      startDate: data.startDate,
      endDate: data.endDate,
      cost: data.cost,
      assignedEmployees: data.assignedEmployees,
      technologiesUsed: data.technologiesUsed,
      status: data.status,
      priority: data.priority,
      isFeatured: data.isFeatured || false
    };

    const response: ProjectResponse = await apiClient.post('/admin/projects', projectData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (
  id: string,
  data: ProjectFormData,
  imageFiles?: File[]
): Promise<ProjectResponse> => {
  try {
    // First upload new images if provided
    let newImageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResponse = await uploadProjectImages(imageFiles);
      newImageUrls = uploadResponse.imageUrls;
    }

    // Prepare update data
    const updateData: UpdateProjectPayload = {
      name: data.name,
      description: data.description,
      images: [...(data.images || []), ...newImageUrls],
      externalLink: data.externalLink,
      startDate: data.startDate,
      endDate: data.endDate,
      cost: data.cost,
      assignedEmployees: data.assignedEmployees,
      technologiesUsed: data.technologiesUsed,
      status: data.status,
      priority: data.priority,
      isFeatured: data.isFeatured
    };

    const response: ProjectResponse = await apiClient.put(`/admin/projects/${id}`, updateData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response: { success: boolean; message: string } = await apiClient.delete(`/admin/projects/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get featured projects
 */
export const getFeaturedProjects = async (limit: number = 6): Promise<Project[]> => {
  try {
    const response: Project[] = await apiClient.get(`/admin/projects/featured?limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get project statistics
 */
export const getProjectStats = async (): Promise<ProjectStatsResponse> => {
  try {
    const response: ProjectStatsResponse = await apiClient.get('/admin/projects/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Search projects
 */
export const searchProjects = async (searchTerm: string, limit: number = 10): Promise<Project[]> => {
  try {
    const response: Project[] = await apiClient.get(`/admin/projects/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle project featured status
 */
export const toggleProjectFeatured = async (id: string): Promise<ProjectResponse> => {
  try {
    const response: ProjectResponse = await apiClient.put(`/admin/projects/${id}/toggle-featured`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee to project
 */
export const addEmployeeToProject = async (projectId: string, employeeId: string): Promise<ProjectResponse> => {
  try {
    const response: ProjectResponse = await apiClient.post(`/admin/projects/${projectId}/employees/${employeeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove employee from project
 */
export const removeEmployeeFromProject = async (projectId: string, employeeId: string): Promise<ProjectResponse> => {
  try {
    const response: ProjectResponse = await apiClient.delete(`/admin/projects/${projectId}/employees/${employeeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload project images
 */
export const uploadProjectImages = async (files: File[]): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response: ImageUploadResponse = await apiClient.post('/admin/projects/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk delete projects
 */
export const bulkDeleteProjects = async (ids: string[]): Promise<BulkOperationResponse> => {
  try {
    const data: BulkDeleteRequest = { ids };
    const response: BulkOperationResponse = await apiClient.post('/admin/projects/bulk-delete', data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk update project status
 */
export const bulkUpdateProjectStatus = async (ids: string[], status: string): Promise<BulkOperationResponse> => {
  try {
    const data: BulkUpdateStatusRequest = { ids, status: status as any };
    const response: BulkOperationResponse = await apiClient.post('/admin/projects/bulk-update-status', data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Export projects data
 */
export const exportProjects = async (params?: ProjectQueryParams): Promise<Blob> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/admin/projects/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    return response instanceof Blob ? response : response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all tasks for a project
 */
export const getProjectTasks = async (projectId: string): Promise<any[]> => {
  try {
    const response: any[] = await apiClient.get(`/admin/projects/${projectId}/tasks`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a new task to project
 */
export const addTaskToProject = async (projectId: string, taskData: any): Promise<any> => {
  try {
    const response: any = await apiClient.post(`/admin/projects/${projectId}/tasks`, taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a specific task in project
 */
export const updateProjectTask = async (projectId: string, taskIndex: number, taskData: any): Promise<any> => {
  try {
    const response: any = await apiClient.put(`/admin/projects/${projectId}/tasks/${taskIndex}`, taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a specific task from project
 */
export const removeProjectTask = async (projectId: string, taskIndex: number): Promise<any> => {
  try {
    const response: any = await apiClient.delete(`/admin/projects/${projectId}/tasks/${taskIndex}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Legacy API functions for backward compatibility
export const getAllProjects = getProjects;
export const getProjectById = getProject;
export const createNewProject = createProject;
export const updateExistingProject = updateProject;
export const removeProject = deleteProject;
