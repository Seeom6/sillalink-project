"use client";

import { useState } from "react";
import { AuthFormInput } from '../../../components/auth/AuthFormInput';
import { AuthTabs } from '../../../components/auth/AuthTabs';
import { AuthFormContainer } from '../../../components/auth/AuthFormContainer';
import { useInitiateRegistration } from "../../../lib/hooks/auth/useRegister";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InitiateRegistrationPayload } from "@/lib/hooks/auth/useRegister";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/Spinner";
import toast from "react-hot-toast";

// Registration form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { mutate, isPending } = useInitiateRegistration();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const registrationData: InitiateRegistrationPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      ...(data.phone && data.phone.trim() && { phone: data.phone }),
    };

    mutate(registrationData, {
      onSuccess: () => {
        // Store email and registration data for OTP verification
        sessionStorage.setItem('registrationEmail', data.email);
        sessionStorage.setItem('registrationFirstName', data.firstName);
        sessionStorage.setItem('registrationLastName', data.lastName);

        // Store complete registration data for resend OTP functionality
        sessionStorage.setItem('registration-data', JSON.stringify(registrationData));

        // Show success message
        toast.success('Verification code sent to your email!');

        // Navigate to OTP verification
        router.push('/auth/verify-otp');
      }
    });
  };

  return (
    <>
      <AuthFormContainer
        title="Welcome to SillaLink!"
        subtitle="Register now and enjoy all features"
      >
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthFormInput
            id="email"
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthFormInput
              id="firstName"
              label="First Name"
              type="text"
              {...register('firstName')}
              error={errors.firstName?.message}
            />

            <AuthFormInput
              id="lastName"
              label="Last Name"
              type="text"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <AuthFormInput
            id="phone"
            label="Phone Number (Optional)"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="Enter your phone number"
          />

          <div className="w-full flex justify-center">
            <button
              disabled={isPending}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full w-full max-w-xs transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? <Spinner size="sm" color="white" /> : "Register"}
            </button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => setActiveTab('login')}
            >
              Login here
            </Link>
          </div>
        </form>
      </AuthFormContainer>
    </>
  );
};

export default RegisterPage;
