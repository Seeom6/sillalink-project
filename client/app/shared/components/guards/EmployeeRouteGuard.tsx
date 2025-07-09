'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '../data-display/LoadingState';

interface EmployeeRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const EmployeeRouteGuard: React.FC<EmployeeRouteGuardProps> = ({
  children,
  fallback = <LoadingState />
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth context to finish loading
      if (authLoading) {
        return;
      }

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // If user has admin/operator role, redirect to admin dashboard
      if (user && ['admin', 'operator'].includes(user.role)) {
        router.push('/admin/dashboard');
        return;
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [isAuthenticated, user, router, authLoading]);

  if (isLoading || authLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
