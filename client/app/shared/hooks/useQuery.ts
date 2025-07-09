'use client';

import { 
  useQuery as useReactQuery, 
  useMutation as useReactMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey
} from '@tanstack/react-query';
import { ApiResponse, ApiError, PaginatedResponse } from '@/types/common';

// Enhanced query hook with better TypeScript support
export const useQuery = <
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    queryKey: TQueryKey;
    queryFn: () => Promise<TQueryFnData>;
  }
) => {
  return useReactQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes default
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as ApiError).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 3;
    },
    ...options,
  });
};

// Enhanced mutation hook
export const useMutation = <
  TData = unknown,
  TError = ApiError,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  return useReactMutation({
    retry: false, // Don't retry mutations by default
    ...options,
  });
};

// Paginated query hook
export const usePaginatedQuery = <TData = unknown, TError = ApiError>(
  queryKey: QueryKey,
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<TData>>,
  options?: Omit<UseQueryOptions<PaginatedResponse<TData>, TError>, 'queryKey' | 'queryFn'> & {
    page?: number;
    limit?: number;
  }
) => {
  const { page = 1, limit = 10, ...queryOptions } = options || {};

  return useQuery({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => queryFn(page, limit),
    keepPreviousData: true,
    ...queryOptions,
  });
};

// Infinite query hook for infinite scrolling
export const useInfiniteQuery = <TData = unknown, TError = ApiError>(
  queryKey: QueryKey,
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<TData>>,
  options?: {
    limit?: number;
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  const { limit = 10, ...queryOptions } = options || {};

  return useReactQuery({
    queryKey: [...queryKey, { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      return queryFn(pageParam as number, limit);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext 
        ? lastPage.pagination.page + 1 
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.hasPrev 
        ? firstPage.pagination.page - 1 
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });
};

// Optimistic update hook
export const useOptimisticMutation = <
  TData = unknown,
  TError = ApiError,
  TVariables = void
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    queryKey: QueryKey;
    updateFn: (oldData: any, variables: TVariables) => any;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
  }
) => {
  const queryClient = useQueryClient();
  const { queryKey, updateFn, onSuccess, onError } = options;

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (oldData: any) => 
        updateFn(oldData, variables)
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Query invalidation helpers
export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  return {
    invalidateQueries: (queryKey: QueryKey) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    invalidateAll: () => {
      return queryClient.invalidateQueries();
    },
    refetchQueries: (queryKey: QueryKey) => {
      return queryClient.refetchQueries({ queryKey });
    },
    removeQueries: (queryKey: QueryKey) => {
      return queryClient.removeQueries({ queryKey });
    },
    setQueryData: <T>(queryKey: QueryKey, data: T) => {
      return queryClient.setQueryData(queryKey, data);
    },
    getQueryData: <T>(queryKey: QueryKey): T | undefined => {
      return queryClient.getQueryData(queryKey);
    },
  };
};

// Prefetch hook
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  return {
    prefetchQuery: <TData>(
      queryKey: QueryKey,
      queryFn: () => Promise<TData>,
      options?: { staleTime?: number }
    ) => {
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options?.staleTime || 5 * 60 * 1000,
      });
    },
  };
};
