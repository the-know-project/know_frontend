"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useTokenRefresh } from "./use-token-refresh";

interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  } | null;
  role: string;
}

export const useAuthStatus = () => {
  const auth = useAuth();
  const { needsRefresh, refreshToken } = useTokenRefresh();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);

      try {
        if (auth.isAuthenticated && needsRefresh()) {
          await refreshToken();
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [auth.isAuthenticated, needsRefresh, refreshToken]);

  const authStatus: AuthStatus = {
    isAuthenticated: auth.isAuthenticated,
    isLoading,
    user: auth.user,
    role: auth.role,
  };

  return authStatus;
};
