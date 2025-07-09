import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '../useToast';
import HandleError from '@/app/lib/ErrorEradication';
import { AuthApi } from '@/app/api/auth/auth.api';

export const useConfirmOtp = () => {
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: any) => AuthApi.confirmOtp(payload),
    onSuccess: () => {
      toast.success("Success", "OTP confirmed successfully");
      router.push("/auth/signup");
    },
    onError: (error) => {
      toast.error("Invalid OTP", HandleError(error));
    }
  });
};
