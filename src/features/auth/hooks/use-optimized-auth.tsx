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

  // Initialize grace period on first load
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
      if (typeof window === "undefined") return;

      const now = Date.now();
      const isHydrated = tokenStore.hasHydrated && roleStore.hasHydrated;
      const isAuthenticated = tokenStore.isAuthenticated;
      const hasToken = !!tokenStore.accessToken;
      const user = tokenStore.user;
      const role = roleStore.role;
      const inGracePeriod = now < graceEndTime.current;

      if (hasToken && inGracePeriod) {
        graceEndTime.current = Date.now();
      }

      const isUserAuthenticated = isAuthenticated && hasToken;
      const hasRequiredRole =
        requiredRoles.length === 0 || (role && requiredRoles.includes(role));

      const canRender =
        !requiresAuth ||
        (isUserAuthenticated && hasRequiredRole) ||
        (inGracePeriod && !hasToken);

      const shouldLoad =
        !isHydrated ||
        (requiresAuth && !isUserAuthenticated && inGracePeriod && !hasToken);

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
        setTimeout(() => {
          if (typeof window !== "undefined") {
            router.push(redirectTo);
          }
        }, 100);
      }
    }, 50); // 50ms debounce
  };

  // Initial check when hydrated
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      tokenStore.hasHydrated &&
      roleStore.hasHydrated
    ) {
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

  // Listen for token changes
  useEffect(() => {
    if (hasRedirected.current || typeof window === "undefined") return;

    const unsubscribe = useTokenStore.subscribe((state, prevState) => {
      if (
        state.isAuthenticated !== prevState.isAuthenticated ||
        state.accessToken !== prevState.accessToken ||
        state.user?.id !== prevState.user?.id ||
        state.hasHydrated !== prevState.hasHydrated
      ) {
        if (state.accessToken && !prevState.accessToken) {
          graceEndTime.current = Date.now();
        }
        updateAuthState();
      }
    });

    return unsubscribe;
  }, [requiresAuth, requiredRoles.join(","), pathname, redirectTo]);

  // Listen for role changes
  useEffect(() => {
    if (hasRedirected.current || typeof window === "undefined") return;

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

export const useAuthReady = () => {
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const isReady = tokenStore.hasHydrated && roleStore.hasHydrated;
  const isAuthenticated =
    tokenStore.isAuthenticated && !!tokenStore.accessToken;
  const user = tokenStore.user;
  const role = roleStore.role;

  return {
    isReady,
    isAuthenticated,
    user,
    role,
  };
};
