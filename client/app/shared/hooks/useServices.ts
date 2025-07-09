'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ServiceRepository } from '@/app/data/repositories/ServiceRepository';
import { Service, ServiceData, ServiceFilters } from '@/app/data/models/Service';
import { useApi, useApiMutation } from './useApi';
import { useToast } from '@/app/hooks/useToast';

// Get services with filtering
export const useServices = (filters: ServiceFilters) => {
  return useApi(
    ['services', filters],
    () => ServiceRepository.getServices(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Get single service by ID
export const useService = (id: string) => {
  return useApi(
    ['services', id],
    () => ServiceRepository.getServiceById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Get active services for main site
export const useActiveServices = (filters?: Partial<ServiceFilters>) => {
  return useApi(
    ['services', 'active', filters],
    () => ServiceRepository.getActiveServices(filters),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get featured services
export const useFeaturedServices = (limit?: number) => {
  return useApi(
    ['services', 'featured', limit],
    () => ServiceRepository.getFeaturedServices(limit),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

// Get popular services
export const usePopularServices = (limit?: number) => {
  return useApi(
    ['services', 'popular', limit],
    () => ServiceRepository.getPopularServices(limit),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
};

// Get services by category
export const useServicesByCategory = (category: string, filters?: Partial<ServiceFilters>) => {
  return useApi(
    ['services', 'category', category, filters],
    () => ServiceRepository.getServicesByCategory(category, filters),
    {
      enabled: !!category,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Create service mutation
export const useCreateService = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (data: ServiceData) => ServiceRepository.createService(data),
    {
      onSuccess: (data: Service) => {
        toast.success("Success!", "Service created successfully");
        queryClient.invalidateQueries({ queryKey: ["services"] });
        router.push("/services");
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to create service. Please try again.");
      }
    }
  );
};

// Update service mutation
export const useUpdateService = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    ({ id, data }: { id: string; data: Partial<ServiceData> }) => 
      ServiceRepository.updateService(id, data),
    {
      onSuccess: (data: Service) => {
        toast.success("Success!", "Service updated successfully");
        queryClient.invalidateQueries({ queryKey: ["services"] });
        queryClient.invalidateQueries({ queryKey: ["services", data.id] });
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to update service. Please try again.");
      }
    }
  );
};

// Delete service mutation
export const useDeleteService = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  return useApiMutation(
    (id: string) => ServiceRepository.deleteService(id),
    {
      onSuccess: () => {
        toast.success("Success!", "Service deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["services"] });
      },
      onError: (err: any) => {
        toast.error("Error", "Failed to delete service. Please try again.");
      }
    }
  );
};

// Search services
export const useSearchServices = (query: string, filters?: Partial<ServiceFilters>) => {
  return useApi(
    ['services', 'search', query, filters],
    () => ServiceRepository.searchServices(query, filters),
    {
      enabled: !!query && query.length > 2,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
    }
  );
};
