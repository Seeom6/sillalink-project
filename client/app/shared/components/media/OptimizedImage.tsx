'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  containerClassName?: string;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  showPlaceholder = true,
  placeholderClassName,
  containerClassName,
  className,
  onLoadComplete,
  onError,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Placeholder */}
      {isLoading && showPlaceholder && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
            placeholderClassName
          )}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      <Image
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={props.priority}
        quality={props.quality || 85}
        {...props}
      />

      {/* Error state */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg 
              className="w-8 h-8 mx-auto mb-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Avatar component with optimized loading
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  className 
}: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (!src) {
    return (
      <div 
        className={cn(
          'rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium',
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
      height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
      className={cn('rounded-full object-cover', sizeClasses[size], className)}
      containerClassName="rounded-full"
      placeholderClassName="rounded-full"
    />
  );
};
