import { useMutation } from "@tanstack/react-query";
import { ILogin, IRole } from "../types/auth.types";
import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { login } from "../api/login/route";
import { LoginResponseDto } from "../dto/auth.dto";
import { useAuth } from "./use-auth";

interface LoginWithRoleInput extends ILogin {
  selectedRole: IRole;
}

interface LoginWithRoleSuccess {
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  };
  role: IRole;
  message: string;
}

export const useLoginWithRole = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (
      ctx: LoginWithRoleInput,
    ): Promise<LoginWithRoleSuccess> => {
      try {
        const { selectedRole, ...loginData } = ctx;
        const data = await login(loginData);
        const validatedData = LoginResponseDto.parse(data);

        if (validatedData.status !== 200 || !validatedData.data) {
          throw new Error(validatedData.message || "Login failed");
        }

        const { id, email, accessToken, refreshToken, firstName, imageUrl } =
          validatedData.data;

        auth.login(
          accessToken,
          refreshToken,
          { id, email, firstName, imageUrl },
          selectedRole,
        );

        return {
          user: { id, email, firstName, imageUrl },
          role: selectedRole,
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
  });
};
