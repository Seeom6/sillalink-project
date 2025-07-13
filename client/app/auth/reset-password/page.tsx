'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

import { setPasswordSchema, SetPasswordFormData } from '@/lib/utils/validation';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { PasswordStrength } from '@/components/shared/ui/password-strength';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const password = watch('password');

  useEffect(() => {
    // Check for reset token
    const token = sessionStorage.getItem('reset-token');
    
    if (!token) {
      toast.error('Reset token not found. Please try the forgot password process again.');
      router.push('/auth/forgot-password');
      return;
    }

    setResetToken(token);
  }, [router]);

  const onSubmit = async (data: SetPasswordFormData) => {
    if (!resetToken) {
      toast.error('Reset token not found. Please try the forgot password process again.');
      router.push('/auth/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword(
        { password: data.password },
        resetToken
      );

      if (response.success && response.data) {
        // Clear session storage
        sessionStorage.removeItem('reset-token');
        
        // Store auth tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', response.data.accessToken);
          localStorage.setItem('refresh-token', response.data.refreshToken);
        }

        toast.success('Password reset successfully!');

        // Auto-login using NextAuth
        const result = await signIn('credentials', {
          email: response.data.user.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          // If auto-login fails, redirect to login page
          router.push('/auth/login');
        } else {
          // Redirect based on user role
          const redirectMap: Record<string, string> = {
            'admin': '/admin/dashboard',
            'operator': '/admin/dashboard',
            'manager': '/admin/dashboard',
            'employee': '/profile',
            'user': '/profile'
          };

          const redirectPath = redirectMap[response.data.user.role] || '/profile';
          router.push(redirectPath);
        }
      } else {
        toast.error(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg">Verifying access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
                 <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary rounded-full"></div>
          <div className="absolute top-24 right-24 w-16 h-16 bg-purple-500/20 rounded-lg transform rotate-45"></div>
         <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-blue-400/30 rounded-full"></div>
         <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-pink-400/30 rounded-full"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                className="mt-1"
                placeholder="Enter your new password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <PasswordStrength password={password || ''} />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                className="mt-1"
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Almost done!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  After resetting your password, you'll be automatically signed in to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
