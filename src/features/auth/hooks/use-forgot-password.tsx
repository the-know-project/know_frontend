import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordResponseDto } from "../dto/auth.dto";
import { IForgotPassword, IForgotPasswordSuccess } from "../types/auth.types";
import { sendOtp } from "../api/forgot-password/send-otp/route";
import { showLog } from "@/src/utils/logger";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (ctx: IForgotPassword): Promise<IForgotPasswordSuccess> => {
      try {
        const data = await sendOtp(ctx);

        showLog({
          context: 'OTP',
          data: data
        })
        const validatedData = ForgotPasswordResponseDto.parse(data);

        if (validatedData.status !== 200) {
          throw new Error(validatedData.message || "Send OTP Failed");
        }

        return {
          status: validatedData.status,
          message: validatedData.message,
        };
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
      console.log(data)
    },
    onError: (error) => {
      console.error(`Send OTP failed ${error}`);
    },
  });
};
