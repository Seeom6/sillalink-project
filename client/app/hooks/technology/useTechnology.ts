import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/hooks/useToast';
import { globalEvents, EVENTS } from '@/app/utils/eventEmitter';
import {
  Technology,
  TechnologyFilters,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
  TechnologyFormData
} from '@/app/types/technologyTypes';
import {
  getTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  toggleTechnologyFeatured,
  getFeaturedTechnologies
} from '@/app/api/technology/technologyApi';

// Hook for managing multiple technologies
export const useTechnologies = (initialFilters: TechnologyFilters = {}) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TechnologyFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const toast = useToast();

  const fetchTechnologies = useCallback(async (newFilters?: TechnologyFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const response = await getTechnologies(filtersToUse);
      
      setTechnologies(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch technologies';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const updateFilters = useCallback((newFilters: Partial<TechnologyFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchTechnologies(updatedFilters);
  }, [filters, fetchTechnologies]);

  const refreshTechnologies = useCallback(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    refreshTechnologies,
    setFilters
  };
};

// Hook for managing a single technology
export const useTechnology = (id?: string) => {
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const toast = useToast();

  const fetchTechnology = useCallback(async (technologyId: string) => {
    // Prevent duplicate requests for the same ID
    if (loading && currentId === technologyId) {
      return;
    }

    setCurrentId(technologyId);
    setLoading(true);
    setError(null);

    try {
      const response = await getTechnology(technologyId);
      setTechnology(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch technology';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast, loading, currentId]);

  useEffect(() => {
    if (id && id !== 'undefined') {
      // Only fetch if the ID has changed
      if (id !== currentId) {
        fetchTechnology(id);
      }
    } else if (id === 'undefined') {
      setError('Invalid technology ID');
    }
  }, [id, fetchTechnology, currentId]);

  return {
    technology,
    loading,
    error,
    refetch: () => id && fetchTechnology(id)
  };
};

// Hook for technology CRUD operations
export const useTechnologyActions = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const createTechnologyAction = useCallback(async (
    data: TechnologyFormData,
    imageFile?: File
  ): Promise<Technology | null> => {
    setLoading(true);
    
    try {
      // Convert form data to API payload, filtering out undefined values
      const rawPayload = {
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        status: data.status,
        difficultyLevel: data.difficultyLevel,
        icon: data.icon,
        images: data.images,
        officialWebsite: data.officialWebsite,
        documentation: data.documentation,
        tags: data.tags,
        relatedTechnologies: data.relatedTechnologies,
        proficiencyLevel: data.proficiencyLevel,
        estimatedLearningHours: data.estimatedLearningHours,
        projectsUsedIn: data.projectsUsedIn,
        prerequisites: data.prerequisites,
        learningResources: data.learningResources,
        notes: data.notes,
        isFeatured: data.isFeatured,
        version: data.version,
        lastUsed: data.lastUsed
      };

      // Filter out undefined values to satisfy exactOptionalPropertyTypes
      const payload: CreateTechnologyPayload = {
        name: rawPayload.name,
        description: rawPayload.description,
        category: rawPayload.category,
        ...(rawPayload.longDescription !== undefined && { longDescription: rawPayload.longDescription }),
        ...(rawPayload.status !== undefined && { status: rawPayload.status }),
        ...(rawPayload.difficultyLevel !== undefined && { difficultyLevel: rawPayload.difficultyLevel }),
        ...(rawPayload.icon !== undefined && { icon: rawPayload.icon }),
        ...(rawPayload.images !== undefined && { images: rawPayload.images }),
        ...(rawPayload.officialWebsite !== undefined && { officialWebsite: rawPayload.officialWebsite }),
        ...(rawPayload.documentation !== undefined && { documentation: rawPayload.documentation }),
        ...(rawPayload.tags !== undefined && { tags: rawPayload.tags }),
        ...(rawPayload.relatedTechnologies !== undefined && { relatedTechnologies: rawPayload.relatedTechnologies }),
        ...(rawPayload.proficiencyLevel !== undefined && { proficiencyLevel: rawPayload.proficiencyLevel }),
        ...(rawPayload.estimatedLearningHours !== undefined && { estimatedLearningHours: rawPayload.estimatedLearningHours }),
        ...(rawPayload.projectsUsedIn !== undefined && { projectsUsedIn: rawPayload.projectsUsedIn }),
        ...(rawPayload.prerequisites !== undefined && { prerequisites: rawPayload.prerequisites }),
        ...(rawPayload.learningResources !== undefined && { learningResources: rawPayload.learningResources }),
        ...(rawPayload.notes !== undefined && { notes: rawPayload.notes }),
        ...(rawPayload.isFeatured !== undefined && { isFeatured: rawPayload.isFeatured }),
        ...(rawPayload.version !== undefined && { version: rawPayload.version }),
        ...(rawPayload.lastUsed !== undefined && { lastUsed: rawPayload.lastUsed })
      };

      const response = await createTechnology(payload, imageFile);
      toast.success('Success!', 'Technology created successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create technology';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateTechnologyAction = useCallback(async (
    id: string,
    data: TechnologyFormData,
    imageFile?: File
  ): Promise<Technology | null> => {
    setLoading(true);
    
    try {
      // Convert form data to API payload, filtering out undefined values
      const rawPayload = {
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        category: data.category,
        status: data.status,
        difficultyLevel: data.difficultyLevel,
        icon: data.icon,
        images: data.images,
        officialWebsite: data.officialWebsite,
        documentation: data.documentation,
        tags: data.tags,
        relatedTechnologies: data.relatedTechnologies,
        proficiencyLevel: data.proficiencyLevel,
        estimatedLearningHours: data.estimatedLearningHours,
        projectsUsedIn: data.projectsUsedIn,
        prerequisites: data.prerequisites,
        learningResources: data.learningResources,
        notes: data.notes,
        isFeatured: data.isFeatured,
        version: data.version,
        lastUsed: data.lastUsed
      };

      // Filter out undefined values to satisfy exactOptionalPropertyTypes
      const payload: Omit<UpdateTechnologyPayload, 'id'> = {
        ...(rawPayload.name !== undefined && { name: rawPayload.name }),
        ...(rawPayload.description !== undefined && { description: rawPayload.description }),
        ...(rawPayload.longDescription !== undefined && { longDescription: rawPayload.longDescription }),
        ...(rawPayload.category !== undefined && { category: rawPayload.category }),
        ...(rawPayload.status !== undefined && { status: rawPayload.status }),
        ...(rawPayload.difficultyLevel !== undefined && { difficultyLevel: rawPayload.difficultyLevel }),
        ...(rawPayload.icon !== undefined && { icon: rawPayload.icon }),
        ...(rawPayload.images !== undefined && { images: rawPayload.images }),
        ...(rawPayload.officialWebsite !== undefined && { officialWebsite: rawPayload.officialWebsite }),
        ...(rawPayload.documentation !== undefined && { documentation: rawPayload.documentation }),
        ...(rawPayload.tags !== undefined && { tags: rawPayload.tags }),
        ...(rawPayload.relatedTechnologies !== undefined && { relatedTechnologies: rawPayload.relatedTechnologies }),
        ...(rawPayload.proficiencyLevel !== undefined && { proficiencyLevel: rawPayload.proficiencyLevel }),
        ...(rawPayload.estimatedLearningHours !== undefined && { estimatedLearningHours: rawPayload.estimatedLearningHours }),
        ...(rawPayload.projectsUsedIn !== undefined && { projectsUsedIn: rawPayload.projectsUsedIn }),
        ...(rawPayload.prerequisites !== undefined && { prerequisites: rawPayload.prerequisites }),
        ...(rawPayload.learningResources !== undefined && { learningResources: rawPayload.learningResources }),
        ...(rawPayload.notes !== undefined && { notes: rawPayload.notes }),
        ...(rawPayload.isFeatured !== undefined && { isFeatured: rawPayload.isFeatured }),
        ...(rawPayload.version !== undefined && { version: rawPayload.version }),
        ...(rawPayload.lastUsed !== undefined && { lastUsed: rawPayload.lastUsed })
      };

      const response = await updateTechnology(id, payload, imageFile);
      toast.success('Success!', 'Technology updated successfully!');

      // 🔧 Fix: Emit event to notify other components of the update
      globalEvents.emit(EVENTS.TECHNOLOGY_UPDATED, response.data);

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update technology';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteTechnologyAction = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);

    try {
      const result = await deleteTechnology(id);

      if (result.success) {
        toast.success('Success!', result.message || 'Technology deleted successfully!');
        return true;
      } else {
        toast.error('Error', result.message || 'Failed to delete technology');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete technology';
      toast.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleFeaturedAction = useCallback(async (id: string): Promise<Technology | null> => {
    setLoading(true);
    
    try {
      const response = await toggleTechnologyFeatured(id);
      toast.success('Success!', response.message);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle featured status';
      toast.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    createTechnology: createTechnologyAction,
    updateTechnology: updateTechnologyAction,
    deleteTechnology: deleteTechnologyAction,
    toggleFeatured: toggleFeaturedAction
  };
};

// Hook for featured technologies
export const useFeaturedTechnologies = (limit = 6) => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toast = useToast();

  const fetchFeaturedTechnologies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFeaturedTechnologies(limit);
      setTechnologies(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured technologies';
      setError(errorMessage);
      toast.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  useEffect(() => {
    fetchFeaturedTechnologies();
  }, [fetchFeaturedTechnologies]);

  return {
    technologies,
    loading,
    error,
    refetch: fetchFeaturedTechnologies
  };
};
