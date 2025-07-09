'use client';

import { useFullPageLoader } from '@/app/hooks/useFullPageloader';

export const FullPageLoader = () => {
  const isLoading = useFullPageLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-300">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
