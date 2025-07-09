// hooks/auth/useAuth.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { AuthApi } from './../../lib/api/auth/auth.api';

export const useAuth = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => AuthApi.getCurrentUser(),
    retry: false,
  });
};