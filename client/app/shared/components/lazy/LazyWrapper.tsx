'use client';

import { Suspense, ComponentType, ReactNode } from 'react';
import { LoadingState } from '../data-display/LoadingState';
import { ErrorBoundary } from 'react-error-boundary';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

const DefaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="text-red-600 text-center">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

export const LazyWrapper = ({ 
  children, 
  fallback = <LoadingState variant="main" type="card" count={1} />,
  errorFallback = DefaultErrorFallback
}: LazyWrapperProps) => {
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
  errorFallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>
) => {
  const LazyComponent = (props: P) => (
    <LazyWrapper fallback={fallback} errorFallback={errorFallback}>
      <Component {...props} />
    </LazyWrapper>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return LazyComponent;
};
