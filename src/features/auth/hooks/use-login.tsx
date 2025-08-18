import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login/route";
import { LoginResponseDto } from "../dto/auth.dto";
import { ILogin, ILoginSuccess } from "../types/auth.types";
import { useAuth } from "./use-auth";

export const useLogin = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (ctx: ILogin): Promise<ILoginSuccess> => {
      try {
        const data = await login(ctx);
        console.log(data);
        const validatedData = LoginResponseDto.parse(data);
        if (validatedData.status !== 200 || !validatedData.data) {
          throw new Error(validatedData.message || "Login Failed");
        }

        const { accessToken, user, role, isFirstTime } = validatedData.data;

        return {
          status: validatedData.status,
          message: validatedData.message,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            imageUrl: user.imageUrl,
          },
          accessToken,
          role,
          isFirstTime,
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
      auth.login(data.accessToken, data.user, data.role || "NONE");
    },
    onError: (error) => {
      auth.logout();
      console.error(`Login failed ${error}`);
    },
  });
};
