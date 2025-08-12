import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordResponseDto } from "../dto/auth.dto";
import { IResetPassword } from "../types/auth.types";
import { createNewPassword } from "../api/new-password/route";

export const useCreateNewPassword = () => {
  return useMutation({
    mutationFn: async (ctx: IResetPassword) => {
      try {
        const result = await createNewPassword(ctx)
        return ResetPasswordResponseDto.parse(result);
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
      console.log(`Failed to reset password ${error.message}`);
    },
  });
};