import apiClient from './client';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RegisterResponse,
  OtpVerificationData,
  OtpResponse,
  SetPasswordData,
  CompleteRegistrationData,
  ResetCodeData,
  ResetTokenResponse,
  UpdateProfileData,
  ChangePasswordData,
  BasicResponse,
  User
} from '@/lib/types/auth';

export const authApi = {
  // Public authentication endpoints
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/website/auth/log-in', credentials),

  register: (data: RegisterData): Promise<RegisterResponse> =>
    apiClient.post('/website/auth/register', data),

  verifyOtp: (data: OtpVerificationData): Promise<OtpResponse> =>
    apiClient.post('/website/auth/verify-registration-otp', data),

  resendOtp: async (_email: string): Promise<BasicResponse> => {
    // Get registration data from sessionStorage to resend OTP
    const registrationData = sessionStorage.getItem('registration-data');
    if (!registrationData) {
      throw new Error('Registration data not found. Please start registration again.');
    }

    const data = JSON.parse(registrationData);
    // Call register endpoint again to resend OTP
    await apiClient.post('/website/auth/register', data);
    return {
      success: true,
      message: 'OTP sent to your email'
    };
  },

  setPassword: (data: CompleteRegistrationData): Promise<AuthResponse> =>
    apiClient.post('/website/auth/complete-registration', data),

  forgotPassword: (email: string): Promise<BasicResponse> =>
    apiClient.post('/website/auth/forgot-password', { email }),

  verifyResetCode: (data: ResetCodeData): Promise<ResetTokenResponse> =>
    apiClient.post('/website/auth/verify-reset-code', data),

  resendResetCode: (email: string): Promise<BasicResponse> =>
    apiClient.post('/website/auth/resend-reset-code', { email }),

  resetPassword: (data: SetPasswordData, token: string): Promise<AuthResponse> =>
    apiClient.post('/website/auth/reset-password', data, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  // Admin authentication endpoints
  adminLogin: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/admin/auth/login', credentials),

  // Token management
  refreshToken: (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> =>
    apiClient.post('/website/auth/refresh-token', { refreshToken }),

  logout: (): Promise<{ success: boolean; message: string }> =>
    apiClient.post('/website/auth/logout'),

  // Get current user
  me: (): Promise<{ success: boolean; data: { user: User } }> =>
    apiClient.get('/website/auth/me'),

  // Profile management
  updateProfile: (data: UpdateProfileData): Promise<{ success: boolean; data: { user: User } }> =>
    apiClient.patch('/website/auth/profile', data),

  changePassword: (data: ChangePasswordData): Promise<BasicResponse> =>
    apiClient.patch('/website/auth/change-password', data),
};
