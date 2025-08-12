import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { SendOtpResponseDto, SignUpResponseDto } from "../dto/auth.dto";
import { useRoleStore } from "../state/store/role.store";
import { ISignUpForm } from "../types/auth.types";
import { sendOtp } from "../api/otp/send-otp/route";

export const useSendOtp = () => {
  const role = useRoleStore((state) => state.role);
  return useMutation({
    mutationFn: async (ctx: ISignUpForm) => {
      try {
        const result = await sendOtp({
          ...ctx,
          role
        });
        return SendOtpResponseDto.parse(result);
      } catch (error) {
        handleAxiosError(error);

        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      }
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(`Failed to send otp ${error.message}`);
    },
  });
};
