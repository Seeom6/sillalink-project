'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'auth' | 'admin';
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = 'default', helperText, className, id, ...props }, ref) => {
    const baseStyles = 'block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantStyles = {
      default: 'border-gray-300 focus:border-primary focus:ring-primary',
      auth: 'text-white border-gray-300 focus:border-primary focus:ring-primary p-2',
      admin: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3 py-2'
    };

    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            baseStyles,
            variantStyles[variant],
            errorStyles,
            className
          )}
          suppressHydrationWarning
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
