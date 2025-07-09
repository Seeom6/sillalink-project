'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ProjectRepository } from '@/app/data/repositories/ProjectRepository';
import { Project, ProjectData, ProjectFilters } from '@/app/data/models/Project';
import { useApi, useApiMutation } from './useApi';
import { useToast } from '@/app/hooks/useToast';

// Get projects with filtering
export const useProjects = (filters: ProjectFilters) => {
  return useApi(
    ['projects', filters],
    () => ProjectRepository.getProjects(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Get single project by ID
export const useProject = (id: string) => {
  return useApi(
    ['projects', id],
    () => ProjectRepository.getProjectById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Get public projects for main site
export const usePublicProjects = (filters?: Partial<ProjectFilters>) => {
  return useApi(
    ['projects', 'public', filters],
    () => ProjectRepository.getPublicProjects(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get featured projects
export const useFeaturedProjects = (limit?: number) => {
  return useApi(
    ['projects', 'featured', limit],
    () => ProjectRepository.getFeaturedProjects(limit),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

// Get projects by category
export const useProjectsByCategory = (category: string, filters?: Partial<ProjectFilters>) => {
  return useApi(
    ['projects', 'category', category, filters],
    () => ProjectRepository.getProjectsByCategory(category, filters),
    {
      enabled: !!category,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Create project mutation
export const useCreateProject = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (data: ProjectData) => ProjectRepository.createProject(data),
    {
      onSuccess: (data: Project) => {
        toast.success("Success!", "Project created successfully");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        router.push("/projects");
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to create project. Please try again.");
      }
    }
  );
};

// Update project mutation
export const useUpdateProject = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, data }: { id: string; data: Partial<ProjectData> }) => 
      ProjectRepository.updateProject(id, data),
    {
      onSuccess: (data: Project) => {
        toast.success("Success!", "Project updated successfully");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to update project. Please try again.");
      }
    }
  );
};

// Delete project mutation
export const useDeleteProject = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: string) => ProjectRepository.deleteProject(id),
    {
      onSuccess: () => {
        toast.success("Success!", "Project deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to delete project. Please try again.");
      }
    }
  );
};

// Search projects
export const useSearchProjects = (query: string, filters?: Partial<ProjectFilters>) => {
  return useApi(
    ['projects', 'search', query, filters],
    () => ProjectRepository.searchProjects(query, filters),
    {
      enabled: !!query && query.length > 2,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
    }
  );
};
