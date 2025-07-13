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

export default function SetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
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
    // Check for registration email
    const email = sessionStorage.getItem('registrationEmail');

    if (!email) {
      toast.error('Registration email not found. Please register again.');
      router.push('/auth/register');
      return;
    }
  }, [router]);

  const onSubmit = async (data: SetPasswordFormData) => {
    // Get email from sessionStorage
    const email = sessionStorage.getItem('registrationEmail');
    if (!email) {
      toast.error('Registration email not found. Please register again.');
      router.push('/auth/register');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.setPassword({
        email,
        password: data.password
      });

      if (response.success && response.data) {
        // Clear session storage
        sessionStorage.removeItem('registrationEmail');
        sessionStorage.removeItem('registrationFirstName');
        sessionStorage.removeItem('registrationLastName');
        sessionStorage.removeItem('registration-data');

        // Store auth tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', response.data.accessToken);
        }

        toast.success('Account created successfully! Welcome to SillaLink');

        // Auto-login using NextAuth
        const result = await signIn('credentials', {
          email: email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          // If auto-login fails, redirect to login page
          router.push('/auth/login');
        } else {
          // Redirect to profile (new users are typically regular users)
          router.push('/profile');
        }
      } else {
        toast.error(response.message || 'Failed to set password. Please try again.');
      }
    } catch (error: any) {
      console.error('Set password error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to set password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
  //     {/* Background decorative elements */}
  //     <div className="absolute inset-0 overflow-hidden">
  //       {/* Top right decorative shape */}
  //       <div className="absolute top-24 right-24 w-16 h-16 bg-purple-500/20 rounded-lg transform rotate-45"></div>
        
  //       {/* Floating geometric shapes */}
  //       <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary rounded-full"></div>
  //       <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-blue-400/30 rounded-full"></div>
  //       <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-pink-400/30 rounded-full"></div>
  //     </div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
         <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary rounded-full"></div>
          <div className="absolute top-24 right-24 w-16 h-16 bg-purple-500/20 rounded-lg transform rotate-45"></div>
         <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-blue-400/30 rounded-full"></div>
         <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-pink-400/30 rounded-full"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Set your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create a strong password to secure your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <Input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                className="mt-1 bg-gray-300"
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <PasswordStrength password={password || ''} />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                className="mt-1 bg-gray-300"
                placeholder="Confirm your password"
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
              {isLoading ? 'Setting Password...' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
