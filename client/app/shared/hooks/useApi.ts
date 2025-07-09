'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

interface UseApiResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseMutationResult<T> {
  mutate: (data: any) => void;
  mutateAsync: (data: any) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

// Generic API hook for GET requests
export function useApi<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: ApiOptions = {}
): UseApiResult<T> {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

// Generic mutation hook for POST/PUT/DELETE requests
export function useApiMutation<T>(
  mutationFn: (data: any) => Promise<T>,
  options: ApiOptions = {}
): UseMutationResult<T> {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

// Hook for invalidating queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    invalidateQueries,
    invalidateAll,
  };
}

// Hook for optimistic updates
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const setOptimisticData = useCallback(
    <T>(queryKey: string[], updater: (oldData: T | undefined) => T) => {
      queryClient.setQueryData(queryKey, updater);
    },
    [queryClient]
  );

  const rollbackOptimisticUpdate = useCallback(
    (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  return {
    setOptimisticData,
    rollbackOptimisticUpdate,
  };
}
