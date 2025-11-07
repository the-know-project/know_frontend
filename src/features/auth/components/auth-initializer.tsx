"use client";

import { useEffect, useState } from "react";
import { useTokenStore } from "@/src/features/auth/state/store";
import { httpClient } from "@/src/lib/http-client";
import TextEffectWithExit from "@/src/shared/components/animate-text";

/**
 * AuthInitializer validates the persisted token on app load
 * and attempts to refresh it if it's expired
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { hasHydrated, accessToken, isAuthenticated, clearAuth } = useTokenStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    async function validateAuth() {
      // Wait for Zustand to rehydrate
      if (!hasHydrated) {
        return;
      }

      // If no token or not authenticated, we're done
      if (!accessToken || !isAuthenticated) {
        setIsValidating(false);
        return;
      }

      try {
        // Attempt to validate token by making a protected request
        // Or attempt a silent refresh
        console.log(" AuthInitializer: Validating persisted token...");

        const result = await httpClient.attemptPublicSilentRefresh();

        if (result.success && result.accessToken) {
          console.log(" AuthInitializer: Token refreshed successfully");
          // Token is automatically updated by the refresh logic
        } else {
          console.log(" AuthInitializer: Token validation failed, clearing auth");
          clearAuth();
        }
      } catch (error) {
        console.error(" AuthInitializer: Token validation error:", error);
        // Don't clear auth on network errors - let the user try
        // clearAuth();
      } finally {
        setIsValidating(false);
      }
    }

    validateAuth();
  }, [hasHydrated, accessToken, isAuthenticated, clearAuth]);

  // Show loading state while validating
  // You can replace this with a proper loading component
  if (!hasHydrated || isValidating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <TextEffectWithExit
          text="Are you in the know"
          style="!font-bebas !text-3xl !text-gray-600 !capitalize"
        />
      </div>
    );
  }

  return <>{children}</>;
}
