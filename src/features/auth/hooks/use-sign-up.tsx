import { useMutation } from "@tanstack/react-query";
import { ISignUp } from "../types/auth.types";
import { handleAxiosError } from "@/src/utils/handle-axios-error";
import Router from "next/router";
import { signUp } from "../api/sign-up/route";
import { SignUpResponseDto } from "../dto/auth.dto";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (ctx: ISignUp) => {
      try {
        const result = await signUp(ctx);
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
      Router.push("/");
    },
    onError: (error) => {
      console.log(`Failed to sign up ${error.message}`);
    },
  });
};
