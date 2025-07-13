"use client";

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        isAdmin: credentials.isAdmin || false,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      return result;
    },
    onSuccess: (data, variables) => {
      toast.success('Login successful!');
      
      // Enhanced role-based redirection
      if (variables.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};
