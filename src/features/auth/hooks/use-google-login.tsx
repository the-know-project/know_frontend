import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "../api/google-login/route";
import { LoginResponseDto } from "../dto/auth.dto";
import { IRole } from "../types/auth.types";
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

export const useGoogleLogin = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (): Promise<LoginSuccess> => {
      try {
        const data = await googleLogin();
        const validatedData = LoginResponseDto.parse(data);
        if (validatedData.status !== 200 || !validatedData.data) {
          throw new Error(validatedData.message || "Google Login Failed");
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

    onSuccess: (data) => {
      auth.login(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user,
        data.role || "NONE",
      );

      console.log(`Google Login Successful : ${data.user}`);
    },
    onError: (error) => {
      auth.logout();
      console.error(`Login failed ${error}`);
    },
  });
};
