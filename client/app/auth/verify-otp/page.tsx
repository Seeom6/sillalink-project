'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { otpVerificationSchema, OtpVerificationFormData } from '@/lib/utils/validation';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/shared/ui/button';
import { OtpInput } from '@/components/shared/ui/otp-input';
import { ResendTimer, CountdownTimer } from '@/components/shared/ui/countdown-timer';

export default function VerifyOtpPage() {
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
  } = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
  });

  const otp = watch('otp');

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = sessionStorage.getItem('registrationEmail');

    const userEmail = emailFromUrl || emailFromStorage;

    if (!userEmail) {
      toast.error('Email not found. Please register again.');
      router.push('/auth/register');
      return;
    }

    setEmail(userEmail);
    setValue('email', userEmail);
  }, [searchParams, router, setValue]);

  const onSubmit = async (data: OtpVerificationFormData) => {
    // Prevent multiple submissions
    if (submittingRef.current || isLoading) {
      return;
    }

    submittingRef.current = true;
    setIsLoading(true);

    try {
      console.log('🔍 Verifying OTP:', { email: data.email, otp: data.otp });

      const response = await authApi.verifyOtp({
        email: data.email,
        otp: data.otp,
      });

      console.log('✅ OTP verification response:', response);

      if (response.success) {
        toast.success('Email verified successfully!');
        router.push('/auth/set-password');
      } else {
        console.error('❌ OTP verification failed:', response);
        toast.error(response.message || 'Invalid verification code. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      console.error('❌ Error response:', error.response?.data);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  const handleOtpChange = (value: string) => {
    setValue('otp', value);
  };

  const handleOtpComplete = (value: string) => {
    setValue('otp', value);
    // Auto-submit when OTP is complete (only if not already loading/submitting)
    if (!isLoading && !submittingRef.current && value.length === 6 && /^\d{6}$/.test(value)) {
      // Add a small delay to ensure the form state is updated
      setTimeout(() => {
        if (!submittingRef.current) {
          onSubmit({ email, otp: value });
        }
      }, 100);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      console.log('🔄 Resending OTP for email:', email);
      const response = await authApi.resendOtp(email);

      console.log('✅ Resend OTP response:', response);

      if (response.success) {
        toast.success('Verification code sent to your email');
      } else {
        console.error('❌ Resend OTP failed:', response);
        toast.error(response.message || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Resend OTP error:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleExpiration = () => {
    toast.error('Verification code expired. Please register again.');
    sessionStorage.removeItem('registrationEmail');
    router.push('/auth/register');
  };
  //  <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
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
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-center text-sm font-medium text-gray-400">
            {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-400 text-center mb-4">
              Enter verification code
            </label>
            <OtpInput
              value={otp || ''}
              onChange={handleOtpChange}
              onComplete={handleOtpComplete}
              disabled={isLoading}
              error={!!errors.otp}
              className='text-gray-300'
            />
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.otp.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ResendTimer
              onResend={handleResendOtp}
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
              disabled={isLoading || !otp || otp.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              Back to registration
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
