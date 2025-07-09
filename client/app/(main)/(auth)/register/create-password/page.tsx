"use client";
import { useEffect, useState } from "react";
import { AuthFormInput } from '../../components/AuthFormInput';
import { AuthFormContainer } from '../../components/AuthFormContainer';
import { useCompleteRegistration } from "../../../../hooks/auth/useRegister";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CompleteRegistrationPayload } from "@/app/api/auth/auth.types";
import Link from "next/link";
import { useRouteLoading } from "@/app/hooks/useRouteLoading";
import { useRouter } from "next/navigation";

// Validation schema for password creation
const createPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const CreatePasswordPage = () => {
  const { mutate, isPending } = useCompleteRegistration();
  const isRouting = useRouteLoading();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(createPasswordSchema),
  });

  useEffect(() => {
    // Get registration data from sessionStorage (client-side only)
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('registrationEmail');
      const storedFirstName = sessionStorage.getItem('registrationFirstName');

      if (!storedEmail) {
        router.push('/register');
        return;
      }

      setEmail(storedEmail);
      setFirstName(storedFirstName || "");
    }
  }, [router]);

  const onSubmit: SubmitHandler<{ password: string; confirmPassword: string }> = (data) => {
    const payload: CompleteRegistrationPayload = {
      email,
      password: data.password,
    };

    mutate(payload, {
      onSuccess: () => {
        // Clear registration data from sessionStorage
        sessionStorage.removeItem('registrationEmail');
        sessionStorage.removeItem('registrationFirstName');
        sessionStorage.removeItem('registrationLastName');
      }
    });
  };

  return (
    <>
      {isRouting && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary animate-pulse z-50"></div>
      )}
      <AuthFormContainer
        title={`Almost there, ${firstName}!`}
        subtitle="Create a secure password for your account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthFormInput
            id="password"
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <AuthFormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <h4 className="font-semibold mb-2">Password Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
            </ul>
          </div>

          <div className="w-full flex justify-center md:justify-end my-10">
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-small md:text-regular w-44 md:w-64 rounded-[33px] py-2 md:py-4 px-5 md:px-10 text-white hover:bg-white focus:ring-purple-500 hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating account...' : 'Complete Registration'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/register/verify-otp"
              className="text-primary hover:underline"
            >
              ← Back to verification
            </Link>
          </div>
        </form>
      </AuthFormContainer>
    </>
  );
};

export default CreatePasswordPage;
