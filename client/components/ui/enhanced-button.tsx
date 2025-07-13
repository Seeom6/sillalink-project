"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface EnhancedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glow?: boolean;
  className?: string;
}

const variants = {
  primary: {
    base: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700',
    shadow: 'shadow-lg hover:shadow-primary-500/25',
  },
  secondary: {
    base: 'bg-dark-700 text-white border-dark-600 hover:bg-dark-600 hover:border-dark-500',
    shadow: 'shadow-lg hover:shadow-dark-500/25',
  },
  outline: {
    base: 'bg-transparent text-primary-400 border-primary-400 hover:bg-primary-400 hover:text-white',
    shadow: 'shadow-md hover:shadow-primary-400/25',
  },
  ghost: {
    base: 'bg-transparent text-gray-300 border-transparent hover:bg-white/10 hover:text-white',
    shadow: 'shadow-none hover:shadow-md',
  },
  gradient: {
    base: 'bg-gradient-to-r from-primary-600 to-accent-purple text-white border-transparent hover:from-primary-700 hover:to-purple-600',
    shadow: 'shadow-lg hover:shadow-primary-500/30',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  glow = false,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = variants[variant];
  
  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      disabled={disabled || loading}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center',
        'font-semibold rounded-xl border transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        
        // Size
        sizes[size],
        
        // Variant
        variantStyles.base,
        variantStyles.shadow,
        
        // Glow effect
        glow && 'shadow-glow',
        
        className
      )}
      {...props}
    >
      {/* Background gradient overlay for hover effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Content */}
      <span className={cn(
        'relative z-10 flex items-center gap-2',
        loading && 'opacity-0'
      )}>
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {children}
        </motion.span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />
    </motion.button>
  );
};

// Specialized button variants
export const CTAButton: React.FC<Omit<EnhancedButtonProps, 'variant'>> = (props) => (
  <EnhancedButton variant="gradient" glow {...props} />
);

export const OutlineButton: React.FC<Omit<EnhancedButtonProps, 'variant'>> = (props) => (
  <EnhancedButton variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<EnhancedButtonProps, 'variant'>> = (props) => (
  <EnhancedButton variant="ghost" {...props} />
);
