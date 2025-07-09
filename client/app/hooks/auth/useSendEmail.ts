import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '../useToast';
import HandleError from '@/app/lib/ErrorEradication';
import { ForgotPasswordPayload } from '@/app/api/auth/auth.types';
import { AuthApi } from '@/app/api/auth/auth.api';

export const useSendEmail = () => {
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => AuthApi.sendOtp(payload),
    onSuccess: (data) => {
      toast.success("Success", "OTP sent to your email");
      router.push("/signup/otp");
    },
    onError: (error) => {
      toast.error("Error", HandleError(error));
    }
  });
};
