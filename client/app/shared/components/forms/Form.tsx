'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'auth' | 'admin';
  children: ReactNode;
}

export const Form = ({ 
  title, 
  subtitle, 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: FormProps) => {
  const variantStyles = {
    default: 'space-y-4',
    auth: 'space-y-4 bg-white p-6 rounded-lg shadow-md',
    admin: 'space-y-6 bg-white p-8 rounded-lg border border-gray-200'
  };

  return (
    <div className={cn(variantStyles[variant])}>
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <form className={cn('space-y-4', className)} {...props}>
        {children}
      </form>
    </div>
  );
};

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export const FormField = ({ children, className }: FormFieldProps) => {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
    </div>
  );
};

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const FormActions = ({ 
  children, 
  className, 
  align = 'right' 
}: FormActionsProps) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={cn(
      'flex gap-3 pt-4',
      alignStyles[align],
      className
    )}>
      {children}
    </div>
  );
};
