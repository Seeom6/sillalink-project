"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

const variants = {
  default: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  primary: {
    background: 'rgba(121, 22, 255, 0.1)',
    border: 'rgba(121, 22, 255, 0.2)',
    shadow: '0 8px 32px 0 rgba(121, 22, 255, 0.2)',
  },
  secondary: {
    background: 'rgba(30, 41, 59, 0.3)',
    border: 'rgba(71, 85, 105, 0.3)',
    shadow: '0 8px 32px 0 rgba(30, 41, 59, 0.3)',
  },
  accent: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.2)',
    shadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2)',
  },
};

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  glow = false,
  className,
  ...props
}) => {
  const variantStyles = variants[variant];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? {
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      className={cn(
        // Base styles
        'relative rounded-2xl backdrop-blur-md border',
        'transition-all duration-300 ease-out',
        sizes[size],
        
        // Glow effect
        glow && 'shadow-glow',
        
        className
      )}
      style={{
        background: variantStyles.background,
        borderColor: variantStyles.border,
        boxShadow: variantStyles.shadow,
      }}
      {...props}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: `linear-gradient(135deg, ${variantStyles.background} 0%, transparent 100%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${variantStyles.border} 0%, transparent 100%)`,
          }}
          whileHover={{ opacity: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Specialized Glass Card variants
export const ProjectCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <GlassCard
    variant="primary"
    size="lg"
    glow
    className={cn("group cursor-pointer", className)}
  >
    {children}
  </GlassCard>
);

export const ServiceCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <GlassCard
    variant="secondary"
    size="md"
    className={cn("group cursor-pointer", className)}
  >
    {children}
  </GlassCard>
);

export const TestimonialCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <GlassCard
    variant="accent"
    size="lg"
    className={cn("text-center", className)}
  >
    {children}
  </GlassCard>
);

export const FeatureCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <GlassCard
    variant="default"
    size="md"
    hover={false}
    className={className}
  >
    {children}
  </GlassCard>
);
