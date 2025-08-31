"use client";

import { usePathname, useRouter } from "next/navigation";
import { RouteProtectionResult } from "../types/route-protection.types";
import { useEffect, useState } from "react";
import { RouteProtectionUtils } from "../utils/route-protection.utils";
import { useRoleStore } from "../state/store";
import { useOptimizedAuth } from "./use-optimized-auth";

interface UseAuthGuardOptions {
  redirectOnUnauthorized?: boolean;
  fallbackComponent?: React.ComponentType;
  onUnauthorized?: (result: RouteProtectionResult) => void;
}

interface AuthGuardState {
  isLoading: boolean;
  isAuthorized: boolean;
  shouldRedirect: boolean;
  redirectTo?: string;
  protectionResult: RouteProtectionResult | null;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectOnUnauthorized = true, onUnauthorized } = options;

  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, isLoading: authLoading, user } = useOptimizedAuth();
  const role = useRoleStore((state) => state.role);

  const [guardState, setGuardState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthorized: false,
    shouldRedirect: false,
    protectionResult: null,
  });

  useEffect(() => {
    if (authLoading) {
      setGuardState((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    const protectionResult = RouteProtectionUtils.checkAccess(
      pathName,
      isAuthenticated,
      role,
    );

    setGuardState({
      isLoading: false,
      isAuthorized: protectionResult.isAllowed,
      shouldRedirect: protectionResult.shouldRedirect,
      redirectTo: protectionResult.redirectTo,
      protectionResult,
    });
    if (!protectionResult.isAllowed) {
      if (onUnauthorized) {
        onUnauthorized(protectionResult);
      }

      if (
        redirectOnUnauthorized &&
        protectionResult.shouldRedirect &&
        protectionResult.redirectTo
      ) {
        router.push(protectionResult.redirectTo);
      }
    }
  }, [
    pathName,
    user,
    isAuthenticated,
    authLoading,
    router,
    redirectOnUnauthorized,
    onUnauthorized,
  ]);

  return guardState;
};
