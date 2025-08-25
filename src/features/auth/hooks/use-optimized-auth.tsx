"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface OptimizedAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  } | null;
  role: string | null;
  hasHydrated: boolean;
  canRender: boolean;
}

interface UseOptimizedAuthOptions {
  requiresAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
  gracePeriod?: number; // Grace period for token refresh (ms)
}

const GUEST_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export const useOptimizedAuth = (options: UseOptimizedAuthOptions = {}) => {
  const {
    requiresAuth = false,
    requiredRoles = [],
    redirectTo = "/login",
    gracePeriod = 2000,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const hasRedirected = useRef(false);
  const graceEndTime = useRef<number>(0);

  const [authState, setAuthState] = useState<OptimizedAuthState>(() => {
    const isHydrated = tokenStore.hasHydrated && roleStore.hasHydrated;

    return {
      isAuthenticated: false,
      isLoading: !isHydrated || requiresAuth,
      user: null,
      role: null,
      hasHydrated: isHydrated,
      canRender: false,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined" && graceEndTime.current === 0) {
      graceEndTime.current = Date.now() + gracePeriod;
    }
  }, [gracePeriod]);

  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const updateAuthState = () => {
    if (hasRedirected.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the update
    debounceRef.current = setTimeout(() => {
      const now = Date.now();
      const isHydrated = tokenStore.hasHydrated && roleStore.hasHydrated;
      const isAuthenticated = tokenStore.isAuthenticated;
      const hasToken = !!tokenStore.accessToken;
      const user = tokenStore.user;
      const role = roleStore.role;
      const inGracePeriod = now < graceEndTime.current;

      const isUserAuthenticated =
        isAuthenticated && (hasToken || inGracePeriod);
      const hasRequiredRole =
        requiredRoles.length === 0 || (role && requiredRoles.includes(role));
      const canRender =
        !requiresAuth ||
        (isUserAuthenticated && hasRequiredRole) ||
        inGracePeriod;
      const shouldLoad =
        !isHydrated || (requiresAuth && !isUserAuthenticated && inGracePeriod);

      setAuthState({
        isAuthenticated: isUserAuthenticated,
        isLoading: shouldLoad,
        user,
        role,
        hasHydrated: isHydrated,
        canRender,
      });

      if (
        isHydrated &&
        !inGracePeriod &&
        requiresAuth &&
        !isUserAuthenticated &&
        !GUEST_ROUTES.includes(pathname) &&
        !hasRedirected.current
      ) {
        hasRedirected.current = true;
        tokenStore.clearAuth();
        roleStore.clearRole();
        setTimeout(() => router.push(redirectTo), 100);
      }

      if (hasToken && inGracePeriod) {
        graceEndTime.current = Date.now();
      }
    }, 50); // 50ms debounce
  };

  useEffect(() => {
    if (tokenStore.hasHydrated && roleStore.hasHydrated) {
      updateAuthState();
    }
  }, [
    tokenStore.hasHydrated,
    roleStore.hasHydrated,
    requiresAuth,
    requiredRoles.join(","),
    pathname,
    redirectTo,
  ]);

  useEffect(() => {
    if (hasRedirected.current) return;

    const unsubscribe = useTokenStore.subscribe((state, prevState) => {
      if (
        state.isAuthenticated !== prevState.isAuthenticated ||
        state.accessToken !== prevState.accessToken ||
        state.user?.id !== prevState.user?.id
      ) {
        updateAuthState();
      }
    });

    return unsubscribe;
  }, [requiresAuth, requiredRoles.join(","), pathname, redirectTo]);

  useEffect(() => {
    if (hasRedirected.current) return;

    const unsubscribe = useRoleStore.subscribe((state, prevState) => {
      if (state.role !== prevState.role) {
        updateAuthState();
      }
    });

    return unsubscribe;
  }, [requiresAuth, requiredRoles.join(","), pathname, redirectTo]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return authState;
};

export const useCanFetchData = () => {
  const { canRender, isAuthenticated } = useOptimizedAuth();
  return canRender && isAuthenticated;
};

export const useRequireAuth = (
  options: Omit<UseOptimizedAuthOptions, "requiresAuth"> = {},
) => {
  return useOptimizedAuth({ ...options, requiresAuth: true });
};

export const useRequireRole = (
  roles: string[],
  options: Omit<UseOptimizedAuthOptions, "requiredRoles"> = {},
) => {
  return useOptimizedAuth({
    ...options,
    requiresAuth: true,
    requiredRoles: roles,
  });
};
