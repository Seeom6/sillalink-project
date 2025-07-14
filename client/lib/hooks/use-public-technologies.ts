import { useQuery } from '@tanstack/react-query';
import {
  publicTechnologiesApi,
  getAllPublicTechnologies,
  getFeaturedPublicTechnologies,
  getPublicTechnologyCategories,
  getPublicTechnologiesByCategory,
  searchPublicTechnologies,
  getPublicTechnologyStats,
  getPublicTechnologyTags
} from '@/lib/api/public/technologies';
import {
  TechnologyFilters,
  SearchOptions
} from '@/lib/types/technology';

// Query Keys for public API
export const publicTechnologyKeys = {
  all: ['public-technologies'] as const,
  lists: () => [...publicTechnologyKeys.all, 'list'] as const,
  list: (filters: Partial<TechnologyFilters>) => [...publicTechnologyKeys.lists(), filters] as const,
  featured: (limit: number) => [...publicTechnologyKeys.all, 'featured', limit] as const,
  categories: () => [...publicTechnologyKeys.all, 'categories'] as const,
  byCategory: (category: string, limit: number) => [...publicTechnologyKeys.all, 'by-category', category, limit] as const,
  search: (options: SearchOptions) => [...publicTechnologyKeys.all, 'search', options] as const,
  stats: () => [...publicTechnologyKeys.all, 'stats'] as const,
  tags: () => [...publicTechnologyKeys.all, 'tags'] as const,
};

// Hooks for public technology queries
export const usePublicTechnologies = (filters: Partial<TechnologyFilters> = {}) => {
  return useQuery({
    queryKey: publicTechnologyKeys.list(filters),
    queryFn: () => getAllPublicTechnologies(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer for public data
  });
};

export const usePublicFeaturedTechnologies = (limit: number = 6) => {
  return useQuery({
    queryKey: publicTechnologyKeys.featured(limit),
    queryFn: () => getFeaturedPublicTechnologies(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const usePublicTechnologyCategories = () => {
  return useQuery({
    queryKey: publicTechnologyKeys.categories(),
    queryFn: getPublicTechnologyCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const usePublicTechnologiesByCategory = (category: string, limit: number = 10) => {
  return useQuery({
    queryKey: publicTechnologyKeys.byCategory(category, limit),
    queryFn: () => getPublicTechnologiesByCategory(category, limit),
    enabled: !!category,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const usePublicSearchTechnologies = (options: SearchOptions) => {
  return useQuery({
    queryKey: publicTechnologyKeys.search(options),
    queryFn: () => searchPublicTechnologies(options),
    enabled: !!options.query && options.query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublicTechnologyStats = () => {
  return useQuery({
    queryKey: publicTechnologyKeys.stats(),
    queryFn: getPublicTechnologyStats,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePublicTechnologyTags = () => {
  return useQuery({
    queryKey: publicTechnologyKeys.tags(),
    queryFn: getPublicTechnologyTags,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
