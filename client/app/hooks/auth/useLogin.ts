'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthApi } from '@/app/api/auth/auth.api';
import { LoginPayload } from '@/app/api/auth/auth.types';
import { useToast } from '../useToast';
import HandleError from '@/app/lib/ErrorEradication';
import { useAuth } from '@/contexts/AuthContext';

export const useLogin = () => {
  const router = useRouter();
  const toast = useToast();
  const { checkAuthStatus } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthApi.login(payload),
    onSuccess: async (data : any) => {
      console.log('Login response:', data); // Debug log

      // Refresh auth context after successful login
      await checkAuthStatus();

      // Wait a moment for auth context to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Cookies are now handled automatically by the server
      // Check user role and redirect appropriately
      const user = data?.data?.user || data?.user;

      console.log('User data for redirect:', user); // Debug log

      if (user?.role === 'admin' || user?.role === 'operator') {
        console.log('Redirecting admin/operator to admin dashboard');
        router.push('/admin/dashboard');
      } else if (user?.role === 'employee' || user?.role === 'user') {
        console.log('Redirecting employee/user to employee dashboard');
        router.push('/employee/dashboard');
      } else {
        console.log('Unknown role, redirecting to employee dashboard. Role:', user?.role);
        // Default redirect for unknown roles
        router.push('/employee/dashboard');
      }

      toast.success("Welcome!", "Login successful");
    },onError:(err)=>{
      console.error('Login error:', err);
      toast.error("Oh ops!" ,HandleError(err))
    }
  });
};