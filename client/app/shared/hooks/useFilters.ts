'use client';

import { useState, useCallback, useMemo } from 'react';

interface FilterConfig {
  [key: string]: any;
}

interface UseFiltersResult<T extends FilterConfig> {
  filters: T;
  setFilter: (key: keyof T, value: any) => void;
  setFilters: (filters: Partial<T>) => void;
  resetFilters: () => void;
  clearFilter: (key: keyof T) => void;
  hasActiveFilters: boolean;
  getFilterParams: () => URLSearchParams;
  setFiltersFromParams: (params: URLSearchParams) => void;
}

export function useFilters<T extends FilterConfig>(
  initialFilters: T
): UseFiltersResult<T> {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  const setFilter = useCallback((key: keyof T, value: any) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
      // Reset page to 1 when filters change (except for page itself)
      ...(key !== 'page' && 'page' in prev ? { page: 1 } : {})
    }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 when multiple filters change
      ...('page' in prev ? { page: 1 } : {})
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback((key: keyof T) => {
    setFiltersState(prev => {
      const newFilters = { ...prev };
      if (key in initialFilters) {
        newFilters[key] = initialFilters[key];
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const currentValue = filters[key];
      const initialValue = initialFilters[key];
      
      // Skip page and limit for active filter detection
      if (key === 'page' || key === 'limit') return false;
      
      // Check if filter has a meaningful value
      if (currentValue === '' || currentValue === 'all' || currentValue === null || currentValue === undefined) {
        return false;
      }
      
      return currentValue !== initialValue;
    });
  }, [filters, initialFilters]);

  const getFilterParams = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        params.append(key, String(value));
      }
    });
    
    return params;
  }, [filters]);

  const setFiltersFromParams = useCallback((params: URLSearchParams) => {
    const newFilters = { ...initialFilters };
    
    params.forEach((value, key) => {
      if (key in newFilters) {
        // Try to parse numbers
        const numValue = Number(value);
        if (!isNaN(numValue) && isFinite(numValue)) {
          newFilters[key as keyof T] = numValue as any;
        } else {
          newFilters[key as keyof T] = value as any;
        }
      }
    });
    
    setFiltersState(newFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    getFilterParams,
    setFiltersFromParams,
  };
}
