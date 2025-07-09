'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/useToast';
import HandleError from '@/app/lib/ErrorEradication';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

interface AuthMutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccessMessage?: {
    title: string;
    description: string;
  };
  onErrorMessage?: {
    title: string;
  };
  redirectTo?: string;
  handleToken?: boolean;
  sessionStorageKey?: string;
  sessionStorageValue?: (data: TData) => string;
  cleanupSessionStorage?: string[];
}

export const useAuthMutation = <TData = any, TVariables = any>(
  config: AuthMutationConfig<TData, TVariables>
) => {
  const router = useRouter();
  const toast = useToast();

  const {
    mutationFn,
    onSuccessMessage,
    onErrorMessage = { title: 'Error' },
    redirectTo,
    handleToken = false,
    sessionStorageKey,
    sessionStorageValue,
    cleanupSessionStorage = [],
  } = config;

  return useMutation({
    mutationFn,
    onSuccess: (data: TData) => {
      // Handle token management
      if (handleToken) {
        const existingToken = getCookie('token');
        if (existingToken) {
          deleteCookie('token');
        }
        
        // Extract token from response (adjust path as needed)
        const token = (data as any)?.data?.data?.accessToken || (data as any)?.data?.accessToken;
        if (token) {
          setCookie('token', token);
        }
      }

      // Handle session storage
      if (sessionStorageKey && sessionStorageValue) {
        sessionStorage.setItem(sessionStorageKey, sessionStorageValue(data));
      }

      // Clean up session storage
      cleanupSessionStorage.forEach(key => {
        sessionStorage.removeItem(key);
      });

      // Show success message
      if (onSuccessMessage) {
        toast.success(onSuccessMessage.title, onSuccessMessage.description);
      }

      // Handle redirect
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error: any) => {
      toast.error(onErrorMessage.title, HandleError(error));
    },
  });
};
