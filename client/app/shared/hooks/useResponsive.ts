'use client';

import { useState, useEffect, useCallback } from 'react';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof BreakpointConfig;

interface UseResponsiveResult {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  currentBreakpoint: BreakpointKey;
  isBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isAboveBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isBelowBreakpoint: (breakpoint: BreakpointKey) => boolean;
}

export function useResponsive(
  breakpoints: Partial<BreakpointConfig> = {}
): UseResponsiveResult {
  const config = { ...defaultBreakpoints, ...breakpoints };
  
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateDimensions();
    
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const getCurrentBreakpoint = useCallback((): BreakpointKey => {
    const { width } = dimensions;
    
    if (width >= config['2xl']) return '2xl';
    if (width >= config.xl) return 'xl';
    if (width >= config.lg) return 'lg';
    if (width >= config.md) return 'md';
    if (width >= config.sm) return 'sm';
    return 'xs';
  }, [dimensions, config]);

  const isBreakpoint = useCallback((breakpoint: BreakpointKey): boolean => {
    return getCurrentBreakpoint() === breakpoint;
  }, [getCurrentBreakpoint]);

  const isAboveBreakpoint = useCallback((breakpoint: BreakpointKey): boolean => {
    return dimensions.width >= config[breakpoint];
  }, [dimensions.width, config]);

  const isBelowBreakpoint = useCallback((breakpoint: BreakpointKey): boolean => {
    return dimensions.width < config[breakpoint];
  }, [dimensions.width, config]);

  const currentBreakpoint = getCurrentBreakpoint();
  
  return {
    width: dimensions.width,
    height: dimensions.height,
    isMobile: dimensions.width < config.md,
    isTablet: dimensions.width >= config.md && dimensions.width < config.lg,
    isDesktop: dimensions.width >= config.lg,
    isLarge: dimensions.width >= config.xl,
    currentBreakpoint,
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint,
  };
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined {
  const { currentBreakpoint } = useResponsive();
  
  // Return the value for current breakpoint or fall back to smaller breakpoints
  const breakpointOrder: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
}
