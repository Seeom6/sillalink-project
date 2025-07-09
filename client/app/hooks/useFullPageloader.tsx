'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const useFullPageLoader = () => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700); // يمكنك تعديله حسب وقت التحميل المتوقع

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return loading;
};
