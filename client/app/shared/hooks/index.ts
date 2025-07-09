// API Hooks
export { useApi, useApiMutation, useInvalidateQueries, useOptimisticUpdate } from './useApi'
export { useAuthMutation } from './useAuthMutation'

// Utility Hooks
export { usePagination } from './usePagination'
export { useFilters } from './useFilters'
export { useResponsive, useResponsiveValue } from './useResponsive'

// Performance Hooks
export {
  useMemoizedValue,
  useMemoizedCallback,
  useDeepMemo,
  useDebouncedValue,
  useThrottledCallback,
  useMemoizedObject,
  useStableReference
} from './useMemoization'

export {
  usePerformanceMonitor,
  useIntersectionObserver,
  useMemoryMonitor,
  useFPSMonitor,
  useBundleAnalyzer
} from './usePerformance'

// Enhanced Query Hooks
export {
  useQuery,
  useMutation,
  usePaginatedQuery,
  useInfiniteQuery,
  useOptimisticMutation,
  useQueryInvalidation,
  usePrefetch
} from './useQuery'
