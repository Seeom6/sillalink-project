"use client";

import { useState, useCallback, useMemo } from 'react';
import { TechnologyFilters } from '@/app/types/technologyTypes';
import { DEFAULT_FILTERS } from '../utils';

/**
 * Hook for managing technology filters with optimized state updates
 */
export const useTechnologyFilters = (initialFilters?: Partial<TechnologyFilters>) => {
  const [filters, setFilters] = useState<TechnologyFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });

  const updateFilters = useCallback((updates: Partial<TechnologyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset page when filters change (except for page changes)
      page: updates.page !== undefined ? updates.page : 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const updateSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key as keyof TechnologyFilters];
      const defaultValue = DEFAULT_FILTERS[key as keyof TechnologyFilters];
      return value !== defaultValue;
    });
  }, [filters]);

  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.difficultyLevel) count++;
    if (filters.isFeatured) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.proficiencyLevel) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    updatePage,
    updateSort,
    hasActiveFilters,
    filterCount
  };
};
