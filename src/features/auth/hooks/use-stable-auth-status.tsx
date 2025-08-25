"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  isRehydrated: boolean;
}

interface UseStableAuthStatusOptions {
  redirectOnExpiry?: boolean;
  redirectTo?: string;
  checkInterval?: number;
  onAuthError?: (error: string) => void;
  onTokenExpired?: () => void;
}

const guestAllowed = [
  "/forgot-password",
  "/reset-password",
  "/login",
  "/signup",
];

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
  const pathname = usePathname();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const isTokenStoreRehydrated = tokenStore.hasHydrated;
  const isRoleStoreRehydrated = roleStore.hasHydrated;
  const isRehydrated = isTokenStoreRehydrated && isRoleStoreRehydrated;

  const [authState, setAuthState] = useState<StableAuthStatus>(() => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    role: null,
    error: null,
    isTokenExpired: false,
    isRehydrated: false,
  }));

  // Prevent multiple simultaneous auth checks
  const checkInProgress = useRef(false);
  const hasRedirected = useRef(false);
  // Grace period for token refresh on page load
  const graceEndTime = useRef<number>(Date.now() + 3000); // 3 second grace period

  const checkAuthStatus = useCallback(() => {
    if (checkInProgress.current || hasRedirected.current || !isRehydrated) {
      return;
    }

    checkInProgress.current = true;

    try {
      const isAuthenticated = tokenStore.isAuthenticated;
      const hasToken = !!tokenStore.accessToken;
      const user = tokenStore.user;
      const role = roleStore.role;
      const now = Date.now();
      const inGracePeriod = now < graceEndTime.current;

      setAuthState((prevState) => {
        const newState: StableAuthStatus = {
          isAuthenticated: isAuthenticated && hasToken,
          isLoading: inGracePeriod && isAuthenticated && !hasToken, // Keep loading during grace period
          user,
          role,
          error: null,
          isTokenExpired: false,
          isRehydrated: true,
        };

        if (
          prevState.isAuthenticated !== newState.isAuthenticated ||
          prevState.isLoading !== newState.isLoading ||
          prevState.user?.id !== newState.user?.id ||
          prevState.role !== newState.role ||
          prevState.isRehydrated !== newState.isRehydrated
        ) {
          return newState;
        }

        return prevState;
      });

      // Only redirect if not in grace period and truly unauthenticated
      if (
        !isAuthenticated &&
        !hasRedirected.current &&
        !guestAllowed.includes(pathname) &&
        !inGracePeriod
      ) {
        console.warn("Authentication lost after grace period");

        if (onAuthError) {
          onAuthError("Authentication lost");
        }

        if (redirectOnExpiry) {
          hasRedirected.current = true;

          tokenStore.clearAuth();
          roleStore.clearRole();

          setAuthState((prevState) => ({
            ...prevState,
            error: "Authentication required",
            isAuthenticated: false,
            isRehydrated: true,
          }));

          setTimeout(() => {
            router.push(redirectTo);
          }, 100);
        }
      }

      // If we get a token during grace period, reset grace period
      if (hasToken && inGracePeriod) {
        graceEndTime.current = Date.now(); // End grace period early since we have token
      }
    } catch (error) {
      console.error("Auth status check failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Auth check failed";

      setAuthState((prevState) => ({
        ...prevState,
        error: errorMessage,
        isLoading: false,
        isRehydrated: true,
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
    isRehydrated,
  ]);

  // Initial auth check - only after rehydration
  useEffect(() => {
    if (isRehydrated) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, isRehydrated]);

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
          isRehydrated: true,
        }));
      }

      previousRole = currentRole;
    });

    return unsubscribe;
  }, [roleStore.role]);

  return authState;
};
