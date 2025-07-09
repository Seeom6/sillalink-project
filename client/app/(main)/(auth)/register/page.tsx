"use client";
import { useState } from "react";
import { AuthFormInput } from '../components/AuthFormInput';
import { AuthTabs } from '../components/AuthTabs';
import { AuthFormContainer } from '../components/AuthFormContainer';
import { useInitiateRegistration } from "../../../hooks/auth/useRegister";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InitiateRegistrationPayload } from "@/app/api/auth/auth.types";
import Link from "next/link";
import { useFullPageLoader } from "@/app/hooks/useFullPageloader";
import { useRouter } from "next/navigation";

// Validation schema for step 1
const initiateRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const RegisterPage = () => {
  const { mutate, isPending } = useInitiateRegistration();
  const isRouting = useFullPageLoader();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitiateRegistrationPayload>({
    resolver: zodResolver(initiateRegistrationSchema),
  });

  const onSubmit: SubmitHandler<InitiateRegistrationPayload> = (data) => {
    mutate(data, {
      onSuccess: () => {
        // Store email in sessionStorage for next steps (client-side only)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('registrationEmail', data.email);
          sessionStorage.setItem('registrationFirstName', data.firstName);
          sessionStorage.setItem('registrationLastName', data.lastName);
        }

        // Navigate to OTP verification
        router.push('/register/verify-otp');
      }
    });
  };

  return (
    <>
      {isRouting && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary animate-pulse z-50"></div>
      )}
      <AuthFormContainer
        title="Welcome to SillaLink!"
        subtitle="Create your account to get started"
      >
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full flex gap-3">
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
            id="email"
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="w-full flex justify-center md:justify-end my-10">
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending verification...' : 'Continue'}
            </button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline"
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
