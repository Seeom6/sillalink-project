"use client";

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

export interface InitiateRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export const useInitiateRegistration = () => {
  return useMutation({
    mutationFn: async (data: InitiateRegistrationPayload) => {
      const response = await authApi.register(data);
      return response;
    },
    onError: (error: any) => {
      console.log(error)
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};
