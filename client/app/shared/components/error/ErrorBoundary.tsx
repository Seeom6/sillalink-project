'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '../forms/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, index) => key !== prevProps.resetKeys?.[index])) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    }, 0);
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, errorInfo!, this.resetErrorBoundary);
      }

      return (
        <DefaultErrorFallback 
          error={error} 
          errorInfo={errorInfo!} 
          resetError={this.resetErrorBoundary} 
        />
      );
    }

    return children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
}

const DefaultErrorFallback = ({ error, errorInfo, resetError }: DefaultErrorFallbackProps) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-red-600">
          <svg 
            className="w-16 h-16 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {isDevelopment && (
          <details className="text-left bg-gray-50 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              <div>
                <strong>Stack:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                  {error.stack}
                </pre>
              </div>
              {errorInfo.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="space-y-3">
          <Button onClick={resetError} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook for using error boundary
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // In a real app, you might want to send this to an error reporting service
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You could also trigger a toast notification here
    throw error; // Re-throw to be caught by ErrorBoundary
  };
};
