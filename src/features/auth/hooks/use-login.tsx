import { useMutation } from "@tanstack/react-query";
import { ILogin } from "../types/auth.types";
import { handleAxiosError } from "@/src/utils/handle-axios-error";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (ctx: ILogin) => {
      try {
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
