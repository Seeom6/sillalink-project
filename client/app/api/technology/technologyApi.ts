import {
  TechnologiesResponse,
  TechnologyResponse,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
  TechnologyFilters,
  TechnologyStats
} from '@/app/types/technologyTypes';
import apiClient from '../apiClient';

// Request deduplication cache
const requestCache = new Map<string, Promise<TechnologyResponse>>();

// Helper function to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// API Functions

/**
 * Get all technologies with optional filtering and pagination
 */
export const getTechnologies = async (filters: TechnologyFilters = {}): Promise<TechnologiesResponse> => {
  try {
    const queryString = buildQueryString(filters);

    // 🔧 Fix: Add cache-busting timestamp to ensure fresh data
    const cacheBuster = `_t=${Date.now()}`;
    const separator = queryString ? '&' : '?';
    const endpoint = `/admin/technologies${queryString ? `?${queryString}` : ''}${separator}${cacheBuster}`;

    const response: TechnologiesResponse = await apiClient.get(endpoint);


    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single technology by ID with request deduplication
 */
export const getTechnology = async (id: string): Promise<TechnologyResponse> => {
  const cacheKey = `getTechnology-${id}`;

  // Check if there's already a pending request for this ID
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  // Create new request
  const requestPromise = (async (): Promise<TechnologyResponse> => {
    try {
      const response: TechnologyResponse = await apiClient.get(`/admin/technologies/${id}`);
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
 * Create a new technology with optional image upload
 */
export const createTechnology = async (
  data: CreateTechnologyPayload,
  imageFile?: File
): Promise<TechnologyResponse> => {
  try {
    const formData = new FormData();

    // Add all technology data to form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Send arrays as JSON strings
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response: TechnologyResponse = await apiClient.post('/admin/technologies', formData, {
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
 * Update an existing technology with optional image upload
 */
export const updateTechnology = async (
  id: string,
  data: Omit<UpdateTechnologyPayload, 'id'>,
  imageFile?: File
): Promise<TechnologyResponse> => {
  try {
    const formData = new FormData();

    // Add the ID to the form data (required by backend DTO)
    formData.append('id', id);

    // Add all technology data to form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Send arrays as JSON strings
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response: TechnologyResponse = await apiClient.put(`/admin/technologies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Delete a technology by ID
 */
export const deleteTechnology = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response: { success: boolean; message: string } = await apiClient.delete(`/admin/technologies/${id}`);
    return response;
  } catch (error: any) {

    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to delete technologies.');
    } else if (error.response?.status === 404) {
      throw new Error('Technology not found or already deleted.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while deleting technology.');
    }

    throw error;
  }
};

/**
 * Get featured technologies
 */
export const getFeaturedTechnologies = async (limit = 6): Promise<TechnologyResponse> => {
  try {
    const response: TechnologyResponse = await apiClient.get(`/admin/technologies/featured/list?limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle featured status of a technology
 */
export const toggleTechnologyFeatured = async (id: string): Promise<TechnologyResponse> => {
  try {
    const response: TechnologyResponse = await apiClient.put(`/admin/technologies/${id}/toggle-featured`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get technology statistics
 */
export const getTechnologyStats = async (): Promise<{ success: boolean; data: TechnologyStats; message: string }> => {
  try {
    const response: { success: boolean; data: TechnologyStats; message: string } = await apiClient.get('/admin/technologies/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk delete technologies
 */
export const bulkDeleteTechnologies = async (ids: string[]): Promise<{ success: boolean; message: string }> => {
  try {
    const response: { success: boolean; message: string } = await apiClient.delete('/admin/technologies/bulk-delete', { data: { ids } });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Export technologies to CSV
 */
export const exportTechnologies = async (filters: TechnologyFilters = {}): Promise<Blob> => {
  try {
    const queryString = buildQueryString({ ...filters, export: 'csv' });
    const endpoint = queryString ? `/admin/technologies/export?${queryString}` : '/admin/technologies/export';

    // For blob responses, the interceptor might not extract data, so we handle it explicitly
    const response = await apiClient.get(endpoint, { responseType: 'blob' });
    // Check if response is already the blob (interceptor worked) or if we need to extract data
    return response instanceof Blob ? response : response.data;
  } catch (error) {
    throw error;
  }
};
