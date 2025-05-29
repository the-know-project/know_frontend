import { useMutation } from "@tanstack/react-query";
import { ILogin } from "../types/auth.types";
import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { login } from "../api/login/route";
import { LoginResponseDto } from "../dto/auth.dto";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (ctx: ILogin) => {
      try {
        const data = await login(ctx);
        return LoginResponseDto.parse(data);
      } catch (error) {
        handleAxiosError(error);

        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      }
    },
  });
};
