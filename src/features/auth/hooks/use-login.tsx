import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login/route";
import { ILogin, ILoginResponseDto, ILoginSuccess } from "../types/auth.types";
import { useAuth } from "./use-auth";
import { err, ok, ResultAsync } from "neverthrow";
import { AuthError } from "../error/auth.error";

export const useLogin = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (ctx: ILogin): Promise<ILoginSuccess> => {
      try {
        const response = await ResultAsync.fromPromise(
          login(ctx),
          (error) =>
            new AuthError(`An error occurred while logging in ${error}`),
        ).andThen((data) => {
          if (data.status === 200) {
            return ok(data);
          } else {
            return err(
              new AuthError(
                `An error occurred while logging in ${data.message}`,
              ),
            );
          }
        });

        if (response.isErr()) {
          throw response.error;
        }

        const result = response.value as ILoginResponseDto;
        const user = result.data.user;

        return {
          status: result.status,
          message: result.message,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            imageUrl: user.imageUrl,
          },
          accessToken: result.data.accessToken,
          role: user.role,
          isFirstTime: user.isFirstTime,
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
