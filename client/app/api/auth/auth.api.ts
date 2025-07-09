// lib/api/auth/auth.api.ts
import apiClient from './../apiClient';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  EmailConfirmResponse,
  VerifyTokenResponse,
  InitiateRegistrationPayload,
  VerifyRegistrationOtpPayload,
  CompleteRegistrationPayload,
  RegistrationResponse,
} from './auth.types';

export const AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post('/website/auth/log-in', payload);
  },

  adminLogin: async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post('/admin/auth/login', payload);
  },

  register: async (payload: RegisterPayload): Promise<LoginResponse> => {
    return apiClient.post('/website/auth/sign-up', payload);
  },

  // New 3-step registration flow
  initiateRegistration: async (payload: InitiateRegistrationPayload): Promise<RegistrationResponse> => {
    return apiClient.post('/website/auth/register', payload);
  },

  verifyRegistrationOtp: async (payload: VerifyRegistrationOtpPayload): Promise<RegistrationResponse> => {
    return apiClient.post('/website/auth/verify-registration-otp', payload);
  },

  completeRegistration: async (payload: CompleteRegistrationPayload): Promise<LoginResponse> => {
    return apiClient.post('/website/auth/complete-registration', payload);
  },

  sendOtp: async (payload: ForgotPasswordPayload): Promise<void> => {
    return apiClient.post('/website/auth/check-email-sing-in', payload);
  },

  confirmOtp: async (payload: { otp: string}): Promise<void> => {
    return apiClient.post('/website/auth/verify-otp', payload);
  },

  confirmEmail: async (payload: ForgotPasswordPayload): Promise<EmailConfirmResponse> => {
    return apiClient.post('/website/auth/sign-in/check-email-sing-in', payload);
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return apiClient.post('/auth/forgot-password', payload);
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    return apiClient.post('/auth/reset-password', payload);
  },

  verifyResetToken: async (token: string): Promise<VerifyTokenResponse> => {
    return apiClient.get(`/auth/verify-reset-token/${token}`);
  },

  getCurrentUser: async (): Promise<LoginResponse['user']> => {
    return apiClient.get('/auth/me');
  },
};
