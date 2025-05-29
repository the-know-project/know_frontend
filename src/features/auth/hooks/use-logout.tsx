import { useMutation } from "@tanstack/react-query";
import { TokenUtils } from "../utils/token.utils";
import { useAuth } from "./use-auth";

export const useLogout = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await TokenUtils.logout();
      } catch (error) {
        console.error("Server logout failed:", error);
      }
    },
    onSuccess: () => {
      auth.logout();

      console.log("Logout successful");
    },
    onError: (error) => {
      auth.logout();

      console.error("Logout error:", error);
    },
  });
};
