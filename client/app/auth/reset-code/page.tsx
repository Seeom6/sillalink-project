'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { resetCodeSchema, ResetCodeFormData } from '@/lib/utils/validation';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/shared/ui/button';
import { OtpInput } from '@/components/shared/ui/otp-input';
import { ResendTimer, CountdownTimer } from '@/components/shared/ui/countdown-timer';

export default function ResetCodePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const submittingRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetCodeFormData>({
    resolver: zodResolver(resetCodeSchema),
  });

  const code = watch('code');

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = sessionStorage.getItem('reset-email');
    
    const userEmail = emailFromUrl || emailFromStorage;
    
    if (!userEmail) {
      toast.error('Email not found. Please try the forgot password process again.');
      router.push('/auth/forgot-password');
      return;
    }

    setEmail(userEmail);
    setValue('email', userEmail);
  }, [searchParams, router, setValue]);

  const onSubmit = async (data: ResetCodeFormData) => {
    // Prevent multiple submissions
    if (submittingRef.current || isLoading) {
      return;
    }

    submittingRef.current = true;
    setIsLoading(true);

    try {
      const response = await authApi.verifyResetCode({
        email: data.email,
        code: data.code,
      });

      if (response.success && response.data?.resetToken) {
        // Store reset token for password reset
        sessionStorage.setItem('reset-token', response.data.resetToken);
        sessionStorage.removeItem('reset-email');

        toast.success('Reset code verified successfully!');
        router.push('/auth/reset-password');
      } else {
        toast.error(response.message || 'Invalid reset code. Please try again.');
      }
    } catch (error: any) {
      console.error('Reset code verification error:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  const handleCodeChange = (value: string) => {
    setValue('code', value);
  };

  const handleCodeComplete = (value: string) => {
    setValue('code', value);
    // Auto-submit when code is complete (only if not already loading/submitting)
    if (!isLoading && !submittingRef.current && value.length === 6) {
      onSubmit({ email, code: value });
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await authApi.resendResetCode(email);
      
      if (response.success) {
        toast.success('Reset code sent to your email');
      } else {
        toast.error(response.message || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      console.error('Resend reset code error:', error);
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleExpiration = () => {
    toast.error('Reset code expired. Please request a new one.');
    sessionStorage.removeItem('reset-email');
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter reset code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit reset code to
          </p>
          <p className="text-center text-sm font-medium text-gray-900">
            {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              Enter reset code
            </label>
            <OtpInput
              value={code || ''}
              onChange={handleCodeChange}
              onComplete={handleCodeComplete}
              disabled={isLoading}
              error={!!errors.code}
            />
            {errors.code && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.code.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ResendTimer
              onResend={handleResendCode}
              disabled={isResending}
              className="text-sm"
            />
            <div className="text-sm text-gray-500">
              Code expires in{' '}
              <CountdownTimer
                initialSeconds={300} // 5 minutes
                onComplete={handleExpiration}
                format="mm:ss"
                className="font-medium text-red-600"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading || !code || code.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to forgot password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
