"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface StableAuthStatus {
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
}

interface UseStableAuthStatusOptions {
  redirectOnExpiry?: boolean;
  redirectTo?: string;
  checkInterval?: number;
  onAuthError?: (error: string) => void;
  onTokenExpired?: () => void;
}

export const useStableAuthStatus = (
  options: UseStableAuthStatusOptions = {},
) => {
  const {
    redirectOnExpiry = true,
    redirectTo = "/login",
    checkInterval = 30000,
    onAuthError,
    onTokenExpired,
  } = options;

  const router = useRouter();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  // Stable state that doesn't change hook order
  const [authState, setAuthState] = useState<StableAuthStatus>(() => ({
    isAuthenticated: tokenStore.isAuthenticated,
    isLoading: true,
    user: tokenStore.user,
    role: roleStore.role,
    error: null,
    isTokenExpired: tokenStore.isTokenExpired(),
  }));

  // Prevent multiple simultaneous auth checks
  const checkInProgress = useRef(false);
  const hasRedirected = useRef(false);

  const checkAuthStatus = useCallback(() => {
    if (checkInProgress.current || hasRedirected.current) {
      return;
    }

    checkInProgress.current = true;

    try {
      const isAuthenticated = tokenStore.isAuthenticated;
      const isExpired = tokenStore.isTokenExpired();
      const user = tokenStore.user;
      const role = roleStore.role;

      setAuthState((prevState) => {
        const newState: StableAuthStatus = {
          isAuthenticated: isAuthenticated && !isExpired,
          isLoading: false,
          user,
          role,
          error: null,
          isTokenExpired: isExpired,
        };

        // Only update if state actually changed
        if (
          prevState.isAuthenticated !== newState.isAuthenticated ||
          prevState.isTokenExpired !== newState.isTokenExpired ||
          prevState.isLoading !== newState.isLoading ||
          prevState.user?.id !== newState.user?.id ||
          prevState.role !== newState.role
        ) {
          return newState;
        }

        return prevState;
      });

      if (isExpired && isAuthenticated) {
        console.warn("Token expired detected");

        if (onTokenExpired) {
          onTokenExpired();
        }

        if (redirectOnExpiry && !hasRedirected.current) {
          hasRedirected.current = true;

          tokenStore.clearTokens();
          roleStore.clearRole();

          setAuthState((prevState) => ({
            ...prevState,
            error: "Session expired",
            isAuthenticated: false,
            isTokenExpired: true,
          }));

          setTimeout(() => {
            router.push(redirectTo);
          }, 100);
        }
      }

      // Handle authentication loss
      if (!isAuthenticated && !hasRedirected.current) {
        console.warn("Authentication lost");

        if (onAuthError) {
          onAuthError("Authentication lost");
        }

        if (redirectOnExpiry) {
          hasRedirected.current = true;

          tokenStore.clearTokens();
          roleStore.clearRole();

          setAuthState((prevState) => ({
            ...prevState,
            error: "Authentication required",
            isAuthenticated: false,
          }));

          setTimeout(() => {
            router.push(redirectTo);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Auth status check failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Auth check failed";

      setAuthState((prevState) => ({
        ...prevState,
        error: errorMessage,
        isLoading: false,
      }));

      if (onAuthError) {
        onAuthError(errorMessage);
      }
    } finally {
      checkInProgress.current = false;
    }
  }, [
    tokenStore,
    roleStore,
    router,
    redirectTo,
    redirectOnExpiry,
    onAuthError,
    onTokenExpired,
  ]);

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic auth checks
  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }

    const interval = setInterval(() => {
      if (!hasRedirected.current) {
        checkAuthStatus();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkAuthStatus, checkInterval]);

  // Subscribe to token store changes
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

      if (previousAuth !== currentAuth) {
        console.log("Token store auth state changed:", {
          previousAuth,
          currentAuth,
        });
        checkAuthStatus();
      }

      previousAuth = currentAuth;
    });

    return unsubscribe;
  }, [checkAuthStatus, tokenStore.isAuthenticated]);

  // Subscribe to role store changes
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
        console.log("Role store state changed:", { previousRole, currentRole });
        setAuthState((prevState) => ({
          ...prevState,
          role: currentRole,
        }));
      }

      previousRole = currentRole;
    });

    return unsubscribe;
  }, [roleStore.role]);

  return authState;
};
