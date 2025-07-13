'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  LoginCredentials,
  RegisterData,
  OtpVerificationData,
  SetPasswordData,
  ResetCodeData,
  UpdateProfileData,
  ChangePasswordData
} from '@/lib/types/auth';
import { authApi } from '@/lib/api/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (credentials: LoginCredentials & { isAdmin?: boolean }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        isAdmin: credentials.isAdmin,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      // Enhanced role-based redirection
      const redirectMap: Record<string, string> = {
        'admin': '/admin/dashboard',
        'operator': '/admin/dashboard',
        'manager': '/admin/dashboard',
        'employee': '/profile',
        'user': '/profile'
      };

      // Get user role from session or default redirection
      if (credentials.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
    }
    
    await signOut({ redirect: false });
    router.push('/');
  };

  // Registration flow methods
  const register = async (data: RegisterData) => {
    return authApi.register(data);
  };

  const verifyOtp = async (data: OtpVerificationData) => {
    return authApi.verifyOtp(data);
  };

  const setPassword = async (email: string, password: string) => {
    return authApi.setPassword({ email, password });
  };

  // Password reset flow methods
  const forgotPassword = async (email: string) => {
    return authApi.forgotPassword(email);
  };

  const verifyResetCode = async (data: ResetCodeData) => {
    return authApi.verifyResetCode(data);
  };

  const resetPassword = async (password: string, token: string) => {
    return authApi.resetPassword({ password }, token);
  };

  // Profile management methods
  const updateProfile = async (data: UpdateProfileData) => {
    return authApi.updateProfile(data);
  };

  const changePassword = async (data: ChangePasswordData) => {
    return authApi.changePassword(data);
  };

  const isAdmin = session?.user?.role === 'admin';
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    user: session?.user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    logout,
    register,
    verifyOtp,
    setPassword,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    updateProfile,
    changePassword,
    session,
  };
}
