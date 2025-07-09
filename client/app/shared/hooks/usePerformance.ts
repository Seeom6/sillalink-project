'use client';

import { useEffect, useRef, useState } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    mountTime.current = performance.now();
    const renderTime = mountTime.current - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  return {
    getRenderTime: () => mountTime.current ? mountTime.current - renderStartTime.current : 0
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  }>({});

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// FPS monitoring
export const useFPSMonitor = () => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const updateFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return fps;
};

// Bundle size analyzer (development only)
export const useBundleAnalyzer = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log loaded modules for bundle analysis
      const modules = Object.keys(window as any).filter(key => 
        key.startsWith('__webpack') || key.startsWith('__turbopack')
      );
      
      console.log('[Bundle] Loaded modules:', modules.length);
    }
  }, []);
};
