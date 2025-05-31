import { useMutation } from "@tanstack/react-query";
import { ILogin, IRole } from "../types/auth.types";
import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { login } from "../api/login/route";
import { LoginResponseDto } from "../dto/auth.dto";
import { useAuth } from "./use-auth";

interface LoginSuccess {
  status: number;
  message: string;
  user: {
    id: string;
    email: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  role?: IRole;
}

export const useLogin = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (ctx: ILogin): Promise<LoginSuccess> => {
      try {
        const data = await login(ctx);
        const validatedData = LoginResponseDto.parse(data);
        if (validatedData.status !== 200 || !validatedData.data) {
          throw new Error(validatedData.message || "Login Failed");
        }

        const { id, email, accessToken, refreshToken } = validatedData.data;

        return {
          status: validatedData.status,
          message: validatedData.message,
          user: { id, email },
          tokens: { accessToken, refreshToken },
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

    onSuccess: (data, variables) => {
      auth.login(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user,
        data.role || "NONE",
      );
      console.log(`Login Successful : ${data.user}`);
    },
    onError: (error) => {
      auth.logout();
      console.error(`Login failed ${error}`);
    },
  });
};
