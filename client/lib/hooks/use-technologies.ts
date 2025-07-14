import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { technologiesApi } from '@/lib/api/admin/technologies';
import {
  Technology,
  CreateTechnologyData,
  UpdateTechnologyData,
  TechnologyFilters
} from '@/lib/types/technology';

// Query Keys
export const technologyKeys = {
  all: ['technologies'] as const,
  lists: () => [...technologyKeys.all, 'list'] as const,
  list: (filters: TechnologyFilters) => [...technologyKeys.lists(), filters] as const,
  details: () => [...technologyKeys.all, 'detail'] as const,
  detail: (id: string) => [...technologyKeys.details(), id] as const,
  stats: () => [...technologyKeys.all, 'stats'] as const,
  categories: () => [...technologyKeys.all, 'categories'] as const,
  tags: () => [...technologyKeys.all, 'tags'] as const,
  featured: (limit: number) => [...technologyKeys.all, 'featured', limit] as const,
};

// Hooks for queries
export const useTechnologies = (filters: TechnologyFilters = {}) => {
  return useQuery({
    queryKey: technologyKeys.list(filters),
    queryFn: () => technologiesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTechnology = (id: string) => {
  return useQuery({
    queryKey: technologyKeys.detail(id),
    queryFn: () => technologiesApi.getById(id),
    enabled: !!id,
  });
};

export const useTechnologyStats = () => {
  return useQuery({
    queryKey: technologyKeys.stats(),
    queryFn: technologiesApi.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTechnologyCategories = () => {
  return useQuery({
    queryKey: technologyKeys.categories(),
    queryFn: technologiesApi.getCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useFeaturedTechnologies = (limit: number = 6) => {
  return useQuery({
    queryKey: technologyKeys.featured(limit),
    queryFn: () => technologiesApi.getFeatured(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hooks for mutations
export const useCreateTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: technologiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technologyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: technologyKeys.stats() });
      toast.success('Technology created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create technology');
    },
  });
};

export const useUpdateTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTechnologyData }) =>
      technologiesApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: technologyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: technologyKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: technologyKeys.stats() });
      toast.success('Technology updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update technology');
    },
  });
};

export const useDeleteTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: technologiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technologyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: technologyKeys.stats() });
      toast.success('Technology deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete technology');
    },
  });
};

export const useUploadTechnologyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      technologiesApi.uploadImage(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: technologyKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: technologyKeys.lists() });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    },
  });
};

// Simple filter management hook
export const useTechnologyFilters = (initialFilters: TechnologyFilters = {}) => {
  const [filters, setFilters] = React.useState<TechnologyFilters>(initialFilters);

  const updateFilters = React.useCallback((newFilters: Partial<TechnologyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters({ page: 1, limit: 10 });
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    setFilters
  };
};
