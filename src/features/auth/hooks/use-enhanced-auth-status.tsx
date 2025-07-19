"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";
import { EnhancedTokenUtils } from "../utils/enhanced-token.utils";

interface EnhancedAuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  } | null;
  role: string | null;
  error: string | null;
  isTokenExpired: boolean;
  isRehydrated: boolean;
  tokenInfo: ReturnType<typeof EnhancedTokenUtils.getTokenInfo>;
}

interface UseEnhancedAuthStatusOptions {
  redirectOnAuthFailure?: boolean;
  redirectTo?: string;
  checkInterval?: number;
  onAuthError?: (error: string) => void;
  onTokenRefreshed?: () => void;
  enableAutoRefresh?: boolean;
  refreshThresholdMinutes?: number;
}

export const useEnhancedAuthStatus = (
  options: UseEnhancedAuthStatusOptions = {},
): EnhancedAuthStatus & {
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  retry: () => Promise<void>;
} => {
  const {
    redirectOnAuthFailure = true,
    redirectTo = "/login",
    checkInterval = 60000, // Check every minute instead of 30 seconds
    onAuthError,
    onTokenRefreshed,
    enableAutoRefresh = true,
    refreshThresholdMinutes = 15, // More generous threshold
  } = options;

  const router = useRouter();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  // Check if stores have rehydrated
  const isTokenStoreRehydrated = tokenStore.hasHydrated;
  const isRoleStoreRehydrated = roleStore.hasHydrated;
  const isRehydrated = isTokenStoreRehydrated && isRoleStoreRehydrated;

  const [authState, setAuthState] = useState<EnhancedAuthStatus>(() => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    role: null,
    error: null,
    isTokenExpired: false,
    isRehydrated: false,
    tokenInfo: { hasToken: false },
  }));

  // Prevent multiple simultaneous operations
  const operationInProgress = useRef(false);
  const hasRedirected = useRef(false);
  const lastRefreshAttempt = useRef(0);

  const updateAuthState = useCallback(() => {
    if (!isRehydrated) {
      return;
    }

    const isAuthenticated = tokenStore.isAuthenticated;
    const user = tokenStore.user;
    const role = roleStore.role;
    const tokenInfo = EnhancedTokenUtils.getTokenInfo();

    setAuthState((prevState) => {
      const newState: EnhancedAuthStatus = {
        isAuthenticated:
          isAuthenticated && tokenInfo.isValid ? tokenInfo.isValid : false,
        isLoading: false,
        user,
        role,
        error: null,
        isTokenExpired: tokenInfo.isExpired || false,
        isRehydrated: true,
        tokenInfo,
      };

      // Only update if something actually changed
      if (
        prevState.isAuthenticated !== newState.isAuthenticated ||
        prevState.isTokenExpired !== newState.isTokenExpired ||
        prevState.isLoading !== newState.isLoading ||
        prevState.user?.id !== newState.user?.id ||
        prevState.role !== newState.role ||
        prevState.isRehydrated !== newState.isRehydrated
      ) {
        return newState;
      }

      return { ...prevState, tokenInfo: newState.tokenInfo };
    });
  }, [isRehydrated, tokenStore, roleStore]);

  const handleAuthFailure = useCallback(
    async (error: string, shouldLogout = true) => {
      if (hasRedirected.current) {
        return;
      }

      console.warn("🚨 Authentication failure:", error);

      if (onAuthError) {
        onAuthError(error);
      }

      if (shouldLogout) {
        hasRedirected.current = true;

        // Clear tokens and redirect
        await EnhancedTokenUtils.logout();
        roleStore.clearRole();

        setAuthState((prevState) => ({
          ...prevState,
          error,
          isAuthenticated: false,
          isTokenExpired: true,
          isRehydrated: true,
        }));

        if (redirectOnAuthFailure) {
          setTimeout(() => {
            router.push(redirectTo);
          }, 100);
        }
      } else {
        setAuthState((prevState) => ({
          ...prevState,
          error,
        }));
      }
    },
    [onAuthError, roleStore, redirectOnAuthFailure, redirectTo, router],
  );

  const attemptTokenRefresh = useCallback(async () => {
    if (operationInProgress.current || hasRedirected.current) {
      return;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - lastRefreshAttempt.current;

    // Don't attempt refresh more than once every 30 seconds
    if (timeSinceLastAttempt < 30000) {
      return;
    }

    lastRefreshAttempt.current = now;
    operationInProgress.current = true;

    try {
      const refreshResult = await EnhancedTokenUtils.smartRefresh();

      if (refreshResult.success) {
        console.log("✅ Token refresh successful");

        if (onTokenRefreshed) {
          onTokenRefreshed();
        }

        // Clear any previous errors
        setAuthState((prevState) => ({
          ...prevState,
          error: null,
        }));

        updateAuthState();
      } else {
        console.error("❌ Token refresh failed:", refreshResult.error);

        if (refreshResult.shouldLogout) {
          await handleAuthFailure(
            refreshResult.error || "Session expired",
            true,
          );
        } else {
          // Don't logout for network errors, just log the error
          setAuthState((prevState) => ({
            ...prevState,
            error: refreshResult.error || "Token refresh failed",
          }));
        }
      }
    } catch (error) {
      console.error("❌ Unexpected error during token refresh:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unexpected refresh error";

      // Don't logout for unexpected errors
      setAuthState((prevState) => ({
        ...prevState,
        error: errorMessage,
      }));
    } finally {
      operationInProgress.current = false;
    }
  }, [updateAuthState, handleAuthFailure, onTokenRefreshed]);

  const checkAuthStatus = useCallback(async () => {
    if (operationInProgress.current || hasRedirected.current || !isRehydrated) {
      return;
    }

    try {
      const tokenInfo = EnhancedTokenUtils.getTokenInfo();

      // If no token exists, handle as auth failure
      if (!tokenInfo.hasToken) {
        await handleAuthFailure("No authentication token", true);
        return;
      }

      // If token is expired, attempt refresh
      if (tokenInfo.isExpired) {
        console.log("🔄 Token expired, attempting refresh...");
        await attemptTokenRefresh();
        return;
      }

      // If token will expire soon and auto-refresh is enabled, refresh proactively
      if (
        enableAutoRefresh &&
        tokenInfo.willExpireSoon &&
        tokenInfo.timeUntilExpiryMinutes < refreshThresholdMinutes
      ) {
        console.log(
          `🔄 Token expiring in ${tokenInfo.timeUntilExpiryMinutes} minutes, refreshing proactively...`,
        );
        await attemptTokenRefresh();
        return;
      }

      // Everything is fine, just update state
      updateAuthState();
    } catch (error) {
      console.error("❌ Auth status check failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Auth check failed";

      setAuthState((prevState) => ({
        ...prevState,
        error: errorMessage,
        isLoading: false,
        isRehydrated: true,
      }));
    }
  }, [
    isRehydrated,
    handleAuthFailure,
    attemptTokenRefresh,
    enableAutoRefresh,
    refreshThresholdMinutes,
    updateAuthState,
  ]);

  // Initial auth check - only after rehydration
  useEffect(() => {
    if (isRehydrated) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, isRehydrated]);

  // Periodic auth status checks
  useEffect(() => {
    if (hasRedirected.current || !enableAutoRefresh) {
      return;
    }

    const interval = setInterval(() => {
      if (!hasRedirected.current) {
        checkAuthStatus();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkAuthStatus, checkInterval, enableAutoRefresh]);

  // Listen to token store changes
  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }

    let previousAuth = tokenStore.isAuthenticated;

    const unsubscribe = useTokenStore.subscribe((state) => {
      if (hasRedirected.current) {
        return;
      }

      const currentAuth = state.isAuthenticated;

      // Only react to significant changes
      if (previousAuth !== currentAuth) {
        console.log("📱 Token store auth state changed:", {
          previousAuth,
          currentAuth,
        });

        // Update state immediately for auth changes
        updateAuthState();
      }

      previousAuth = currentAuth;
    });

    return unsubscribe;
  }, [updateAuthState, tokenStore.isAuthenticated]);

  // Listen to role store changes
  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }

    let previousRole = roleStore.role;

    const unsubscribe = useRoleStore.subscribe((state) => {
      if (hasRedirected.current) {
        return;
      }

      const currentRole = state.role;

      if (previousRole !== currentRole) {
        console.log("👤 Role store state changed:", {
          previousRole,
          currentRole,
        });

        setAuthState((prevState) => ({
          ...prevState,
          role: currentRole,
          isRehydrated: true,
        }));
      }

      previousRole = currentRole;
    });

    return unsubscribe;
  }, [roleStore.role]);

  // Manual refresh function
  const refreshTokens = useCallback(async () => {
    await attemptTokenRefresh();
  }, [attemptTokenRefresh]);

  // Reset error function
  const clearError = useCallback(() => {
    setAuthState((prevState) => ({
      ...prevState,
      error: null,
    }));
  }, []);

  return {
    ...authState,
    refreshTokens,
    clearError,
    retry: checkAuthStatus,
  };
};
