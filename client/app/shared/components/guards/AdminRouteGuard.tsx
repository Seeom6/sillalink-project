'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '../data-display/LoadingState';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  fallback = <LoadingState />
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // For development, bypass authentication immediately
  if (process.env.NODE_ENV === 'development') {
    // Reduce console noise by using a module-level flag
    if (typeof window !== 'undefined' && !(window as any).__adminDevModeLogged) {
      console.log('AdminRouteGuard - Development mode, bypassing auth completely');
      (window as any).__adminDevModeLogged = true;
    }
    return <>{children}</>;
  }

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

      // Check if user has admin or operator role
      if (user && !['admin', 'operator'].includes(user.role)) {
        router.push('/employee/dashboard');
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
