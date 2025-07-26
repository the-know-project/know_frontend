"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRoleStore, useTokenStore } from "../state/store";
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
    checkInterval = 1800000, // Check every 30 minutes instead of 30 seconds
    onAuthError,
    onTokenRefreshed,
    enableAutoRefresh = true,
    refreshThresholdMinutes = 30, // More generous threshold
  } = options;

  const router = useRouter();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  // Check if stores have rehydrated
  const isTokenStoreRehydrated = tokenStore.hasHydrated;
  const isRoleStoreRehydrated = roleStore.hasHydrated;
  const isRehydrated = isTokenStoreRehydrated && isRoleStoreRehydrated;

  const [authState, setAuthState] = useState<EnhancedAuthStatus>(() => {
    const initialTokenInfo = EnhancedTokenUtils.getTokenInfo();
    return {
      isAuthenticated: false,
      isLoading: true,
      user: null,
      role: null,
      error: null,
      isTokenExpired: false,
      isRehydrated: false,
      tokenInfo: initialTokenInfo,
    };
  });

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

    // If user exists but has no ID, trigger logout
    if (user && !user.id && isAuthenticated) {
      handleAuthFailure("No user ID found", true);
      return;
    }

    setAuthState((prevState) => {
      const newIsAuthenticated = Boolean(
        isAuthenticated && tokenInfo.isValid && user?.id,
      );
      const newIsTokenExpired = tokenInfo.isExpired || false;
      const newUserId = user?.id;

      // Only update if something actually changed
      if (
        prevState.isAuthenticated !== newIsAuthenticated ||
        prevState.isTokenExpired !== newIsTokenExpired ||
        prevState.isLoading !== false ||
        prevState.user?.id !== newUserId ||
        prevState.role !== role ||
        prevState.isRehydrated !== true ||
        prevState.error !== null
      ) {
        return {
          isAuthenticated: newIsAuthenticated,
          isLoading: false,
          user,
          role,
          error: null,
          isTokenExpired: newIsTokenExpired,
          isRehydrated: true,
          tokenInfo,
        };
      }

      // Only update tokenInfo if it actually changed
      if (JSON.stringify(prevState.tokenInfo) !== JSON.stringify(tokenInfo)) {
        return { ...prevState, tokenInfo };
      }

      return prevState;
    });
  }, [
    isRehydrated,
    tokenStore.isAuthenticated,
    tokenStore.user,
    roleStore.role,
  ]);

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

        // Show user-friendly notification
        toast.error("Session Expired", {
          description: "Your session has expired. Please log in again.",
          duration: 4000,
        });

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
          }, 2000); // Give user time to read the notification
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

        // Clear any previous errors and update state
        setAuthState((prevState) => {
          if (prevState.error === null) {
            return prevState;
          }
          return {
            ...prevState,
            error: null,
          };
        });

        // Use setTimeout to ensure the token store has been updated
        setTimeout(() => {
          updateAuthState();
        }, 0);
      } else {
        // Handle different types of refresh failures
        if (refreshResult.shouldLogout) {
          console.error(
            "❌ Token refresh failed - authentication required:",
            refreshResult.error,
          );
          await handleAuthFailure(
            "Your session has expired and could not be renewed",
            true,
          );
        } else if (refreshResult.retryable) {
          // For retryable failures, log silently and don't update UI state
          // The enhanced token utils will retry automatically in the background
          console.log(
            "🔄 Token refresh failed but will retry silently:",
            refreshResult.error,
          );
          // Don't update error state for retryable failures to avoid user confusion
        } else {
          // Non-retryable but also not requiring logout (rare case)
          console.warn("⚠️ Token refresh failed:", refreshResult.error);
          const errorMessage = refreshResult.error || "Token refresh failed";
          setAuthState((prevState) => {
            if (prevState.error === errorMessage) {
              return prevState;
            }
            return {
              ...prevState,
              error: errorMessage,
            };
          });
        }
      }
    } catch (error) {
      console.warn(
        "⚠️ Unexpected error during token refresh (will retry silently):",
        error,
      );

      // For unexpected errors, don't update UI state as the system will retry
      // Only log for debugging purposes
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected refresh error";

      // Don't show errors to user for unexpected failures
      // The retry mechanism will handle this automatically
    } finally {
      operationInProgress.current = false;
    }
  }, [updateAuthState, handleAuthFailure, onTokenRefreshed]);

  const checkAuthStatus = useCallback(async () => {
    if (operationInProgress.current || hasRedirected.current || !isRehydrated) {
      return;
    }

    try {
      const user = tokenStore.user;
      const tokenInfo = EnhancedTokenUtils.getTokenInfo();

      // If no token exists, handle as auth failure
      if (!tokenInfo.hasToken) {
        await handleAuthFailure("No authentication token", true);
        return;
      }

      // If user exists but has no ID, handle as auth failure
      if (!user || !user.id) {
        await handleAuthFailure("No user ID found", true);
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

      setAuthState((prevState) => {
        if (
          prevState.error === errorMessage &&
          prevState.isLoading === false &&
          prevState.isRehydrated === true
        ) {
          return prevState;
        }
        return {
          ...prevState,
          error: errorMessage,
          isLoading: false,
          isRehydrated: true,
        };
      });
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
    if (isRehydrated && !operationInProgress.current) {
      checkAuthStatus();
    }
  }, [isRehydrated]);

  // Periodic auth status checks
  useEffect(() => {
    if (hasRedirected.current || !enableAutoRefresh) {
      return;
    }

    const interval = setInterval(() => {
      if (!hasRedirected.current && !operationInProgress.current) {
        checkAuthStatus();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, enableAutoRefresh]);

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

        setAuthState((prevState) => {
          if (
            prevState.role === currentRole &&
            prevState.isRehydrated === true
          ) {
            return prevState;
          }
          return {
            ...prevState,
            role: currentRole,
            isRehydrated: true,
          };
        });
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
    setAuthState((prevState) => {
      if (prevState.error === null) {
        return prevState;
      }
      return {
        ...prevState,
        error: null,
      };
    });
  }, []);

  return {
    ...authState,
    refreshTokens,
    clearError,
    retry: checkAuthStatus,
  };
};
