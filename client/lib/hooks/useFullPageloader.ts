"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useFullPageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for route changes
    const originalPush = router.push;
    router.push = (...args: Parameters<typeof router.push>) => {
      handleStart();
      const result = originalPush.apply(router, args);

      // Handle completion after a short delay for route changes
      setTimeout(handleComplete, 100);
      return result;
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  return isLoading;
};
