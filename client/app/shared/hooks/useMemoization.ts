'use client';

import { useMemo, useCallback, useRef, useEffect, useState, DependencyList } from 'react';

// Memoized computation hook
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: DependencyList
): T => {
  return useMemo(factory, deps);
};

// Memoized callback hook with stable reference
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T => {
  return useCallback(callback, deps);
};

// Deep comparison memoization
export const useDeepMemo = <T>(
  factory: () => T,
  deps: DependencyList
): T => {
  const ref = useRef<{ deps: DependencyList; value: T }>();
  
  const hasChanged = !ref.current || 
    deps.length !== ref.current.deps.length ||
    deps.some((dep, index) => !Object.is(dep, ref.current!.deps[index]));

  if (hasChanged) {
    ref.current = {
      deps: [...deps],
      value: factory()
    };
  }

  return ref.current.value;
};

// Debounced value hook for performance
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized object creation
export const useMemoizedObject = <T extends Record<string, any>>(
  factory: () => T,
  deps: DependencyList
): T => {
  return useMemo(factory, deps);
};

// Stable reference hook
export const useStableReference = <T>(value: T): T => {
  const ref = useRef<T>(value);
  
  // Only update if the value has actually changed
  if (!Object.is(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
};
