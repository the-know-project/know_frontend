import { useMemo } from "react";
import { useRoleStore, useTokenStore } from "../state/store";
import { IRole } from "../types/auth.types";
import { httpClient } from "../../../lib/http-client";

export const useAuth = () => {
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const authState = useMemo(
    () => ({
      isAuthenticated: tokenStore.isAuthenticated && !!tokenStore.accessToken,
      isLoading: false,

      user: tokenStore.user,
      role: roleStore.role,

      accessToken: tokenStore.accessToken,
      hasValidToken: () => !!tokenStore.accessToken,

      login: (
        accessToken: string,
        user: {
          id: string;
          email: string;
          firstName: string;
          imageUrl: string;
        },
        role: IRole,
      ) => {
        tokenStore.setAccessToken(accessToken, user);
        roleStore.setRole(role);
      },

      logout: async () => {
        try {
          await httpClient.logout();
        } catch (error) {
          console.warn("Logout error:", error);
          tokenStore.clearAuth();
          roleStore.clearRole();
        }
      },

      updateAccessToken: tokenStore.updateAccessToken,
    }),
    [tokenStore, roleStore],
  );

  return authState;
};
