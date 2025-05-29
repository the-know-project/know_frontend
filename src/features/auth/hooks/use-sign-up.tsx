import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/sign-up/route";
import { SignUpResponseDto } from "../dto/auth.dto";
import { useRoleStore } from "../state/store/role.store";
import { ISignUp } from "../types/auth.types";

export const useSignUp = () => {
  const role = useRoleStore((state) => state.role);
  return useMutation({
    mutationFn: async (ctx: Omit<ISignUp, "role">) => {
      try {
        const result = await signUp({
          ...ctx,
          role: role,
        });
        return SignUpResponseDto.parse(result);
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
      console.log(`Failed to sign up ${error.message}`);
    },
  });
};
