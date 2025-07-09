"use client";
import { useEffect, useState } from "react";
import { AuthFormInput } from '../../components/AuthFormInput';
import { AuthFormContainer } from '../../components/AuthFormContainer';
import { useVerifyRegistrationOtp } from "../../../../hooks/auth/useRegister";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VerifyRegistrationOtpPayload } from "@/app/api/auth/auth.types";
import Link from "next/link";
import { useRouteLoading } from "@/app/hooks/useRouteLoading";
import { useRouter } from "next/navigation";

// Validation schema for OTP
const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const VerifyOtpPage = () => {
  const { mutate, isPending } = useVerifyRegistrationOtp();
  const isRouting = useRouteLoading();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ otp: string }>({
    resolver: zodResolver(verifyOtpSchema),
  });

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('registrationEmail');
    if (!storedEmail) {
      router.push('/register');
      return;
    }
    setEmail(storedEmail);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit: SubmitHandler<{ otp: string }> = (data) => {
    const payload: VerifyRegistrationOtpPayload = {
      email,
      otp: data.otp,
    };

    mutate(payload, {
      onSuccess: () => {
        // Navigate to password creation
        router.push('/register/create-password');
      }
    });
  };

  const handleResendOtp = () => {
    // TODO: Implement resend OTP functionality
    setTimeLeft(300); // Reset timer
  };

  return (
    <>
      {isRouting && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary animate-pulse z-50"></div>
      )}
      <AuthFormContainer
        title="Verify Your Email"
        subtitle={`We sent a 6-digit code to ${email}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthFormInput
            id="otp"
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...register('otp')}
            error={errors.otp?.message}
          />

          <div className="text-center text-sm text-gray-600">
            {timeLeft > 0 ? (
              <p>Code expires in {formatTime(timeLeft)}</p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-primary hover:underline"
              >
                Resend verification code
              </button>
            )}
          </div>

          <div className="w-full flex justify-center md:justify-end my-10">
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/register"
              className="text-primary hover:underline"
            >
              ← Back to registration
            </Link>
          </div>
        </form>
      </AuthFormContainer>
    </>
  );
};

export default VerifyOtpPage;
