import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { ValidateOtpResponseDto } from "../dto/auth.dto";
import { vaidateOtp } from "../api/otp/validate-otp/route";
import { IOtpForm } from "../types/auth.types";

export const useValidateOtp = () => {
  return useMutation({
    mutationFn: async (ctx: IOtpForm) => {
      try {
        const result = await vaidateOtp(ctx)
        return ValidateOtpResponseDto.parse(result);
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
      console.log(`Failed to validate otp ${error.message}`);
    },
  });
};