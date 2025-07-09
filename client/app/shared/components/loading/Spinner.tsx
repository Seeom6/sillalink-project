'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className 
}: SpinnerProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  const colorStyles = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };

  return (
    <div 
      className={cn(
        'rounded-full animate-spin',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'fullscreen' | 'container';
  className?: string;
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = 'Loading...', 
  variant = 'container',
  className 
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  const variantStyles = {
    fullscreen: 'fixed inset-0 z-50',
    container: 'absolute inset-0 z-10'
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-center bg-white/80 backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex flex-col items-center space-y-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-gray-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ 
  className, 
  variant = 'text',
  width,
  height 
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div 
      className={cn(
        'bg-gray-200 animate-pulse',
        variantStyles[variant],
        className
      )}
      style={style}
    />
  );
};
