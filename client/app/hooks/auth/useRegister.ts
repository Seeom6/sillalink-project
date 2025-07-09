'use client';

import { AuthApi } from '@/app/api/auth/auth.api';
import { RegisterPayload, InitiateRegistrationPayload, VerifyRegistrationOtpPayload, CompleteRegistrationPayload } from '@/app/api/auth/auth.types';
import { useAuthMutation } from '@/hooks/useAuthMutation';

export const useRegister = () => {
  return useAuthMutation({
    mutationFn: (payload: RegisterPayload) => AuthApi.register(payload),
    handleToken: true,
    redirectTo: "/dashboard",
    onErrorMessage: { title: 'Registration Failed' }
  });
};

export const useConfirmEmail = () => {
  return useAuthMutation({
    mutationFn: (payload: RegisterPayload) => AuthApi.confirmEmail(payload),
    handleToken: true,
    redirectTo: "/sign-in/otp",
    onErrorMessage: { title: 'Email Confirmation Failed' }
  });
};



// New 3-step registration hooks
export const useInitiateRegistration = () => {
  return useAuthMutation({
    mutationFn: (payload: InitiateRegistrationPayload) => AuthApi.initiateRegistration(payload),
    onSuccessMessage: {
      title: 'Success!',
      description: 'Please check your email for the verification code.'
    },
    sessionStorageKey: 'registrationEmail',
    sessionStorageValue: (data: any) => data?.email || '',
    redirectTo: '/register/verify-otp',
    onErrorMessage: { title: 'Registration Failed' }
  });
};

export const useVerifyRegistrationOtp = () => {
  return useAuthMutation({
    mutationFn: (payload: VerifyRegistrationOtpPayload) => AuthApi.verifyRegistrationOtp(payload),
    onSuccessMessage: {
      title: 'Success!',
      description: 'Email verified successfully!'
    },
    redirectTo: '/register/create-password',
    onErrorMessage: { title: 'Verification Failed' }
  });
};

export const useCompleteRegistration = () => {
  return useAuthMutation({
    mutationFn: (payload: CompleteRegistrationPayload) => AuthApi.completeRegistration(payload),
    handleToken: true,
    onSuccessMessage: {
      title: 'Welcome!',
      description: 'Your account has been created successfully!'
    },
    cleanupSessionStorage: ['registrationEmail'],
    redirectTo: '/dashboard',
    onErrorMessage: { title: 'Registration Failed' }
  });
};