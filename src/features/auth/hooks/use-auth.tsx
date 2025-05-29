import { useMemo } from "react";
import { useRoleStore, useTokenStore } from "../state/store";

export const useAuth = () => {
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const authState = useMemo(
    () => ({
      isAuthenticated:
        tokenStore.isAuthenticated && !tokenStore.isTokenExpired(),
      isLoading: false, // will be implemented later with token refresh

      user: tokenStore.user,
      role: roleStore.role,

      accessToken: tokenStore.accessToken,
      hasValidToken: () =>
        tokenStore.accessToken && !tokenStore.isTokenExpired(),

      login: (
        accessToken: string,
        refreshToken: string,
        user: { id: string; email: string },
        role: "ARTIST" | "BUYER" | "NONE",
      ) => {
        tokenStore.setTokens(accessToken, refreshToken, user);
        roleStore.setRole(role);
      },

      logout: () => {
        tokenStore.clearTokens();
        roleStore.clearRole();
      },

      updateAccessToken: tokenStore.updateAccessToken,
    }),
    [tokenStore, roleStore],
  );

  return authState;
};
