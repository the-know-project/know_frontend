"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOptimizedAuth } from "../hooks/use-optimized-auth";
import TextEffectWithExit from "@/src/shared/components/animate-text";

interface OptimizedAuthGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
  loadingFallback?: React.ComponentType | React.ReactNode;
  unauthorizedFallback?: React.ComponentType | React.ReactNode;
}

/**
 * Optimized AuthGuard Component
 *
 * Provides faster, more user-friendly authentication protection with:
 * - Reduced loading times
 * - Grace period for token refresh
 * - Better loading states
 * - Smoother user experience on page refresh
 */
export const OptimizedAuthGuard: React.FC<OptimizedAuthGuardProps> = ({
  children,
  requiresAuth = false,
  requiredRoles = [],
  redirectTo = "/login",
  loadingFallback,
  unauthorizedFallback,
}) => {
  const authState = useOptimizedAuth({
    requiresAuth,
    requiredRoles,
    redirectTo,
    gracePeriod: 1000, // 1 second grace period
  });

  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("🔍 OptimizedAuthGuard Debug:", {
      requiresAuth,
      isLoading: authState.isLoading,
      isAuthenticated: authState.isAuthenticated,
      canRender: authState.canRender,
      hasHydrated: authState.hasHydrated,
      user: !!authState.user,
      role: authState.role,
    });
  }

  if (authState.isLoading) {
    if (loadingFallback) {
      return typeof loadingFallback === "function"
        ? React.createElement(loadingFallback)
        : loadingFallback;
    }

    return <OptimizedLoadingFallback />;
  }

  if (requiresAuth && !authState.canRender) {
    if (unauthorizedFallback) {
      return typeof unauthorizedFallback === "function"
        ? React.createElement(unauthorizedFallback)
        : unauthorizedFallback;
    }

    return <UnauthorizedFallback />;
  }

  return <>{children}</>;
};

const OptimizedLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <TextEffectWithExit
        text="Are you in the know"
        style="!font-bebas !text-3xl !text-gray-600 !capitalize"
      />
    </div>
  </div>
);

const UnauthorizedFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900">
        Access Denied
      </h2>
      <p className="mb-4 text-gray-600">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

export const PageGuard: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles = [] }) => (
  <OptimizedAuthGuard
    requiresAuth={true}
    requiredRoles={roles}
    redirectTo="/login"
  >
    {children}
  </OptimizedAuthGuard>
);

// Guest-only guard (for login, signup, etc)
export const GuestOnlyGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasHydrated } = useOptimizedAuth({
    requiresAuth: false,
  });

  useEffect(() => {
    if (hasHydrated && isAuthenticated && !isLoading) {
      router.push("/explore");
    }
  }, [hasHydrated, isAuthenticated, isLoading, router]);

  if (isLoading || !hasHydrated) {
    return <OptimizedLoadingFallback />;
  }

  if (isAuthenticated) {
    return <OptimizedLoadingFallback />;
  }

  return <>{children}</>;
};

// Public guard (no auth required, but can access auth state)
export const PublicGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading } = useOptimizedAuth({ requiresAuth: false });

  if (isLoading) {
    return <OptimizedLoadingFallback />;
  }

  return <>{children}</>;
};

// Role-specific guards
export const ArtistGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <PageGuard roles={["ARTIST"]}>{children}</PageGuard>;

export const BuyerGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <PageGuard roles={["BUYER"]}>{children}</PageGuard>;
