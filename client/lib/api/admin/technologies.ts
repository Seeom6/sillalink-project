import apiClient from '../client';
import {
  Technology,
  CreateTechnologyData,
  UpdateTechnologyData,
  TechnologyFilters,
  TechnologyListResponse,
  TechnologyStats,
  CategoryOption,
  FileUploadResponse
} from '@/lib/types/technology';

// Additional interfaces for API
interface SearchOptions {
  query: string;
  limit?: number;
}

interface BulkUpdateData {
  ids: string[];
  status?: string;
}

interface BulkDeleteData {
  ids: string[];
}

const BASE_URL = '/admin/technologies';

export const technologiesApi = {
  // Get all technologies with filters and pagination
  getAll: async (filters: TechnologyFilters = {}): Promise<TechnologyListResponse> => {
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

    const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Get single technology by ID
  getById: async (id: string): Promise<Technology> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new technology
  create: async (data: CreateTechnologyData): Promise<Technology> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // Update technology
  update: async (id: string, data: UpdateTechnologyData): Promise<Technology> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete technology
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  // Upload technology image
  uploadImage: async (id: string, file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`${BASE_URL}/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload technology icon
  uploadIcon: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`${BASE_URL}/upload-icon`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get technology statistics
  getStats: async (): Promise<TechnologyStats> => {
    const response = await apiClient.get(`${BASE_URL}/stats/overview`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<CategoryOption[]> => {
    const response = await apiClient.get(`${BASE_URL}/categories`);
    return response.data;
  },

  // Search technologies
  search: async (options: SearchOptions): Promise<Technology[]> => {
    const params = new URLSearchParams({
      q: options.query,
      limit: String(options.limit || 10)
    });
    
    const response = await apiClient.get(`${BASE_URL}/search?${params.toString()}`);
    return response.data;
  },

  // Get featured technologies
  getFeatured: async (limit: number = 6): Promise<Technology[]> => {
    const response = await apiClient.get(`${BASE_URL}/featured?limit=${limit}`);
    return response.data;
  },

  // Get technologies by category
  getByCategory: async (category: string, limit: number = 10): Promise<Technology[]> => {
    const response = await apiClient.get(`${BASE_URL}/by-category/${category}?limit=${limit}`);
    return response.data;
  },

  // Get technologies by tags
  getByTags: async (tags: string[], limit: number = 10): Promise<Technology[]> => {
    const params = new URLSearchParams({
      tags: tags.join(','),
      limit: String(limit)
    });
    
    const response = await apiClient.get(`${BASE_URL}/by-tags?${params.toString()}`);
    return response.data;
  },

  // Get all available tags
  getAllTags: async (): Promise<string[]> => {
    const response = await apiClient.get(`${BASE_URL}/tags`);
    return response.data.tags || [];
  },

  // Update proficiency level
  updateProficiency: async (id: string, proficiencyLevel: number): Promise<Technology> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/proficiency`, {
      proficiencyLevel
    });
    return response.data;
  },

  // Bulk operations
  bulkUpdateStatus: async (data: BulkUpdateData): Promise<void> => {
    await apiClient.put(`${BASE_URL}/bulk/status`, data);
  },

  bulkDelete: async (data: BulkDeleteData): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/bulk`, { data });
  },

  // Duplicate technology
  duplicate: async (id: string, newName: string): Promise<Technology> => {
    const response = await apiClient.post(`${BASE_URL}/${id}/duplicate`, {
      name: newName
    });
    return response.data;
  }
};

// Export individual functions for easier imports
export const {
  getAll: getAllTechnologies,
  getById: getTechnologyById,
  create: createTechnology,
  update: updateTechnology,
  delete: deleteTechnology,
  uploadImage: uploadTechnologyImage,
  uploadIcon: uploadTechnologyIcon,
  getStats: getTechnologyStats,
  getCategories: getTechnologyCategories,
  search: searchTechnologies,
  getFeatured: getFeaturedTechnologies,
  getByCategory: getTechnologiesByCategory,
  getByTags: getTechnologiesByTags,
  getAllTags: getAllTechnologyTags,
  updateProficiency: updateTechnologyProficiency,
  bulkUpdateStatus: bulkUpdateTechnologyStatus,
  bulkDelete: bulkDeleteTechnologies,
  duplicate: duplicateTechnology
} = technologiesApi;
