'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '../data-display/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  fallback = <LoadingState />,
  redirectTo = '/login'
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    // If no specific roles are required, just check if authenticated
    if (allowedRoles.length === 0) {
      setIsAuthorized(true);
      return;
    }

    // Check if user has one of the allowed roles
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      // Redirect based on user role
      const userRedirectTo = ['admin', 'operator'].includes(user.role) 
        ? '/admin/dashboard' 
        : '/employee/dashboard';
      router.push(userRedirectTo);
      return;
    }

    setIsAuthorized(true);
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
