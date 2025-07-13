import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/hooks/useToast';
import { globalEvents, EVENTS } from '@/app/utils/events';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectStats,
  searchProjects,
  toggleProjectFeatured,
  addEmployeeToProject,
  removeEmployeeFromProject,
  uploadProjectImages,
  bulkDeleteProjects,
  bulkUpdateProjectStatus,
  exportProjects
} from '@/app/api/project/projectApi';
import {
  Project,
  ProjectFormData,
  ProjectQueryParams,
  ProjectStatus,
  ProjectPriority,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '@/app/types/projectTypes';

// Hook for managing a single project
export const useProject = (id?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const toast = useToast();

  const fetchProject = useCallback(async (projectId: string) => {
    // Prevent duplicate requests for the same ID
    if (loading && currentId === projectId) {
      return;
    }

    setCurrentId(projectId);
    setLoading(true);
    setError(null);

    try {
      const response = await getProject(projectId);
      setProject(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, currentId, toast]);

  useEffect(() => {
    if (id && id !== 'undefined') {
      if (id !== currentId) {
        fetchProject(id);
      }
    } else if (id === 'undefined') {
      setError('Invalid project ID');
    }
  }, [id, currentId, fetchProject]);

  const refreshProject = useCallback(() => {
    if (currentId) {
      fetchProject(currentId);
    }
  }, [currentId, fetchProject]);

  return {
    project,
    loading,
    error,
    refreshProject,
    fetchProject
  };
};

// Hook for managing projects list
export const useProjects = (initialParams?: ProjectQueryParams) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [params, setParams] = useState<ProjectQueryParams>({
    ...DEFAULT_PROJECT_QUERY_PARAMS,
    ...initialParams
  });
  const toast = useToast();

  const fetchProjects = useCallback(async (queryParams?: ProjectQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const finalParams = { ...params, ...queryParams };
      const response = await getProjects(finalParams);
      
      setProjects(response.data.projects);
      setPagination({
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      });
      setParams(finalParams);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const refreshProjects = useCallback(() => {
    fetchProjects(params);
  }, [fetchProjects, params]);

  const updateParams = useCallback((newParams: Partial<ProjectQueryParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    fetchProjects(updatedParams);
  }, [params, fetchProjects]);

  return {
    projects,
    loading,
    error,
    pagination,
    params,
    fetchProjects,
    refreshProjects,
    updateParams
  };
};

// Hook for project actions (CRUD operations)
export const useProjectActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const createProjectAction = useCallback(async (data: ProjectFormData, imageFiles?: File[]): Promise<Project | null> => {
    setLoading(true);
    try {
      const response = await createProject(data, imageFiles);
      toast.success('Success!', 'Project created successfully!');
      
      // Emit event to notify other components
      globalEvents.emit(EVENTS.PROJECT_CREATED, response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProjectAction = useCallback(async (id: string, data: ProjectFormData, imageFiles?: File[]): Promise<Project | null> => {
    setLoading(true);
    try {
      const response = await updateProject(id, data, imageFiles);
      toast.success('Success!', 'Project updated successfully!');

      // Emit event to notify other components of the update
      globalEvents.emit(EVENTS.PROJECT_UPDATED, response.data);

      return response.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteProjectAction = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await deleteProject(id);

      if (result.success) {
        toast.success('Success!', result.message || 'Project deleted successfully!');
        
        // Emit event to notify other components
        globalEvents.emit(EVENTS.PROJECT_DELETED, { id });
        
        return true;
      } else {
        toast.error('Error', result.message || 'Failed to delete project');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      toast.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleFeatured = useCallback(async (id: string): Promise<Project | null> => {
    setLoading(true);
    try {
      const response = await toggleProjectFeatured(id);
      toast.success('Success!', 'Project featured status updated!');
      
      // Emit event to notify other components
      globalEvents.emit(EVENTS.PROJECT_UPDATED, response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle featured status';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addEmployee = useCallback(async (projectId: string, employeeId: string): Promise<Project | null> => {
    setLoading(true);
    try {
      const response = await addEmployeeToProject(projectId, employeeId);
      toast.success('Success!', 'Employee added to project successfully!');
      
      // Emit event to notify other components
      globalEvents.emit(EVENTS.PROJECT_UPDATED, response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add employee to project';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeEmployee = useCallback(async (projectId: string, employeeId: string): Promise<Project | null> => {
    setLoading(true);
    try {
      const response = await removeEmployeeFromProject(projectId, employeeId);
      toast.success('Success!', 'Employee removed from project successfully!');
      
      // Emit event to notify other components
      globalEvents.emit(EVENTS.PROJECT_UPDATED, response.data);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove employee from project';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    setLoading(true);
    try {
      const response = await uploadProjectImages(files);
      toast.success('Success!', response.message);
      return response.imageUrls;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      toast.error('Error', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await bulkDeleteProjects(ids);
      if (response.success) {
        toast.success('Success!', response.message);
        
        // Emit event to notify other components
        globalEvents.emit(EVENTS.PROJECTS_BULK_DELETED, { ids, deletedCount: response.deletedCount });
        
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete projects';
      toast.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: ProjectStatus): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await bulkUpdateProjectStatus(ids, status);
      if (response.success) {
        toast.success('Success!', response.message);
        
        // Emit event to notify other components
        globalEvents.emit(EVENTS.PROJECTS_BULK_UPDATED, { ids, status, updatedCount: response.updatedCount });
        
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project status';
      toast.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    createProject: createProjectAction,
    updateProject: updateProjectAction,
    deleteProject: deleteProjectAction,
    toggleFeatured,
    addEmployee,
    removeEmployee,
    uploadImages,
    bulkDelete,
    bulkUpdateStatus
  };
};

// Hook for featured projects
export const useFeaturedProjects = (limit: number = 6) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchFeaturedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const projects = await getFeaturedProjects(limit);
      setProjects(projects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured projects';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects: fetchFeaturedProjects
  };
};

// Hook for project statistics
export const useProjectStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProjectStats();
      setStats(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project statistics';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};

// Hook for getting available employees for project assignment
export const useGetAvailableEmployees = () => {
  const [employees, setEmployees] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for now - replace with actual API call
      const mockEmployees = [
        { value: '1', label: 'John Doe' },
        { value: '2', label: 'Jane Smith' },
        { value: '3', label: 'Mike Johnson' },
        { value: '4', label: 'Sarah Wilson' },
        { value: '5', label: 'David Brown' }
      ];

      setEmployees(mockEmployees);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employees';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees
  };
};

// Hook for getting available managers for project assignment
export const useGetAvailableManagers = () => {
  const [managers, setManagers] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for now - replace with actual API call
      const mockManagers = [
        { value: '1', label: 'Alice Johnson (Senior PM)' },
        { value: '2', label: 'Bob Smith (Lead Developer)' },
        { value: '3', label: 'Carol Davis (Project Director)' },
        { value: '4', label: 'Daniel Wilson (Technical Lead)' }
      ];

      setManagers(mockManagers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch managers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  return {
    managers,
    loading,
    error,
    refetch: fetchManagers
  };
};
