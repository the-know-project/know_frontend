"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { useTokenRefresh } from "./use-token-refresh";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface SafeAuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  } | null;
  role: string;
  error: string | null;
  isTokenExpired: boolean;
}

interface UseSafeAuthStatusOptions {
  redirectOnExpiry?: boolean;
  redirectTo?: string;
  maxRetries?: number;
  onAuthError?: (error: string) => void;
}

export const useSafeAuthStatus = (options: UseSafeAuthStatusOptions = {}) => {
  const {
    redirectOnExpiry = true,
    redirectTo = "/login",
    maxRetries = 2,
    onAuthError,
  } = options;

  const router = useRouter();
  const auth = useAuth();
  const { needsRefresh, refreshToken } = useTokenRefresh();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Use ref to prevent infinite re-renders
  const authCheckInProgress = useRef(false);
  const lastAuthState = useRef<boolean>(auth.isAuthenticated);

  // Stable error handler
  const handleAuthError = useCallback(
    (errorMessage: string) => {
      console.error("Auth error:", errorMessage);
      setError(errorMessage);

      if (onAuthError) {
        onAuthError(errorMessage);
      }

      if (
        retryCount >= maxRetries ||
        errorMessage.includes("refresh_token_invalid")
      ) {
        console.warn(
          "Max retries exceeded or critical auth error, redirecting to login",
        );
        tokenStore.clearTokens();
        roleStore.clearRole();

        if (redirectOnExpiry) {
          router.push(redirectTo);
        }
      }
    },
    [
      retryCount,
      maxRetries,
      onAuthError,
      redirectOnExpiry,
      redirectTo,
      router,
      tokenStore,
      roleStore,
    ],
  );

  const checkAuthStatus = useCallback(async () => {
    if (authCheckInProgress.current) {
      return;
    }

    authCheckInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const expired = tokenStore.isTokenExpired();
      setIsTokenExpired(expired);

      if (!auth.isAuthenticated) {
        setIsLoading(false);
        authCheckInProgress.current = false;
        return;
      }

      if (expired || needsRefresh()) {
        setIsRefreshing(true);

        try {
          const refreshSuccess = await refreshToken();

          if (!refreshSuccess) {
            throw new Error("Token refresh failed");
          }

          // Reset retry count on success
          setRetryCount(0);
          setIsTokenExpired(false);
        } catch (refreshError) {
          const errorMessage =
            refreshError instanceof Error
              ? refreshError.message
              : "Token refresh failed";

          setRetryCount((prev) => prev + 1);
          handleAuthError(errorMessage);
          return;
        } finally {
          setIsRefreshing(false);
        }
      }

      // Reset retry count and error on successful auth check
      if (auth.isAuthenticated && !tokenStore.isTokenExpired()) {
        setRetryCount(0);
        setError(null);
        setIsTokenExpired(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication check failed";

      setRetryCount((prev) => prev + 1);
      handleAuthError(errorMessage);
    } finally {
      setIsLoading(false);
      authCheckInProgress.current = false;
    }
  }, [
    auth.isAuthenticated,
    needsRefresh,
    refreshToken,
    handleAuthError,
    tokenStore,
  ]);

  // Monitor auth state changes
  useEffect(() => {
    const currentAuthState = auth.isAuthenticated;

    // If auth state changed unexpectedly (e.g., token expired), trigger check
    if (lastAuthState.current && !currentAuthState) {
      console.warn("Auth state changed unexpectedly, checking auth status");
      checkAuthStatus();
    }

    lastAuthState.current = currentAuthState;
  }, [auth.isAuthenticated, checkAuthStatus]);

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic token expiration check
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(() => {
      if (tokenStore.isTokenExpired() && !isRefreshing) {
        console.warn("Token expired, triggering auth check");
        checkAuthStatus();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, isRefreshing, checkAuthStatus, tokenStore]);

  // Subscribe to token store changes
  useEffect(() => {
    let previousState = {
      isAuthenticated: tokenStore.isAuthenticated,
      accessToken: tokenStore.accessToken,
    };

    const unsubscribe = useTokenStore.subscribe((state) => {
      const currentState = {
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      };

      if (previousState.isAuthenticated && !currentState.isAuthenticated) {
        console.warn("Token store indicates auth loss");
        setIsTokenExpired(true);

        if (!authCheckInProgress.current) {
          checkAuthStatus();
        }
      }

      previousState = currentState;
    });

    return unsubscribe;
  }, [checkAuthStatus, tokenStore.isAuthenticated, tokenStore.accessToken]);

  const authStatus: SafeAuthStatus = {
    isAuthenticated: auth.isAuthenticated && !isTokenExpired,
    isLoading: isLoading || isRefreshing,
    user: auth.user,
    role: auth.role,
    error,
    isTokenExpired,
  };

  return authStatus;
};
