"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "../hooks/use-auth-status";
import { routeProtectionService } from "../service/route-protection.service";
import { RouteProtectionResult } from "../types/route-protection.types";

interface RouteMiddlewareState {
  isLoading: boolean;
  canAccess: boolean;
  shouldRedirect: boolean;
  redirectTo?: string;
  protectionResult: RouteProtectionResult | null;
}

interface UseRouteMiddlewareOptions {
  enabled?: boolean;
  onAccessDenied?: (result: RouteProtectionResult) => void;
  onRedirect?: (from: string, to: string) => void;
  redirectDelay?: number;
}

export const useRouteMiddleware = (options: UseRouteMiddlewareOptions = {}) => {
  const {
    enabled = true,
    onAccessDenied,
    onRedirect,
    redirectDelay = 0,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading, role } = useAuthStatus();

  const [middlewareState, setMiddlewareState] = useState<RouteMiddlewareState>({
    isLoading: true,
    canAccess: true,
    shouldRedirect: false,
    protectionResult: null,
  });

  const checkRouteAccess = useCallback(async () => {
    if (!enabled || authLoading) {
      setMiddlewareState((prev) => ({ ...prev, isLoading: authLoading }));
      return;
    }

    try {
      // Check route protection
      const protectionResult = routeProtectionService.checkRouteAccess(
        pathname,
        isAuthenticated,
        role,
      );

      setMiddlewareState({
        isLoading: false,
        canAccess: protectionResult.isAllowed,
        shouldRedirect: protectionResult.shouldRedirect,
        redirectTo: protectionResult.redirectTo,
        protectionResult,
      });

      // Handle access denied
      if (!protectionResult.isAllowed) {
        if (onAccessDenied) {
          onAccessDenied(protectionResult);
        }

        // Handle redirect with optional delay
        if (protectionResult.shouldRedirect && protectionResult.redirectTo) {
          if (onRedirect) {
            onRedirect(pathname, protectionResult.redirectTo);
          }

          if (redirectDelay > 0) {
            setTimeout(() => {
              router.push(protectionResult.redirectTo!);
            }, redirectDelay);
          } else {
            router.push(protectionResult.redirectTo);
          }
        }
      }
    } catch (error) {
      console.error("Route middleware error:", error);
      setMiddlewareState({
        isLoading: false,
        canAccess: false,
        shouldRedirect: true,
        redirectTo: "/",
        protectionResult: null,
      });
    }
  }, [
    enabled,
    authLoading,
    pathname,
    isAuthenticated,
    role,
    router,
    onAccessDenied,
    onRedirect,
    redirectDelay,
  ]);

  useEffect(() => {
    checkRouteAccess();
  }, [checkRouteAccess]);

  return middlewareState;
};
