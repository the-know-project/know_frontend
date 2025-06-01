"use client";

import React from "react";
import { useRouteMiddleware } from "./use-route-middleware";
import { RouteProtectionResult } from "../types/route-protection.types";

interface RouteMiddlewareProps {
  children: React.ReactNode;
  fallback?: React.ComponentType | React.ReactNode;
  loadingComponent?: React.ComponentType | React.ReactNode;
  accessDeniedComponent?: React.ComponentType<{
    result: RouteProtectionResult;
  }>;
  onAccessDenied?: (result: RouteProtectionResult) => void;
  onRedirect?: (from: string, to: string) => void;
  redirectDelay?: number;
  enabled?: boolean;
}

/**
 * RouteMiddleware Component
 *
 * Acts as a middleware layer for route protection.
 */
export const RouteMiddleware: React.FC<RouteMiddlewareProps> = ({
  children,
  fallback,
  loadingComponent: LoadingComponent,
  accessDeniedComponent: AccessDeniedComponent,
  onAccessDenied,
  onRedirect,
  redirectDelay = 0,
  enabled = true,
}) => {
  const { isLoading, canAccess, shouldRedirect, protectionResult } =
    useRouteMiddleware({
      enabled,
      onAccessDenied,
      onRedirect,
      redirectDelay,
    });

  // Show loading state while checking access
  if (isLoading) {
    if (LoadingComponent) {
      return typeof LoadingComponent === "function" ? (
        <LoadingComponent />
      ) : (
        LoadingComponent
      );
    }
    return <MiddlewareLoadingFallback />;
  }

  // Show access denied (only if not redirecting)
  if (!canAccess && !shouldRedirect) {
    if (AccessDeniedComponent && protectionResult) {
      return <AccessDeniedComponent result={protectionResult} />;
    }

    if (fallback) {
      return typeof fallback === "function"
        ? React.createElement(fallback)
        : fallback;
    }

    return <MiddlewareAccessDeniedFallback result={protectionResult} />;
  }

  // Show content if access is allowed
  if (canAccess) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return <MiddlewareRedirectingFallback />;
};

/**
 * Default loading component
 */
const MiddlewareLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Checking access permissions...</p>
    </div>
  </div>
);

/**
 * Default access denied component
 */
const MiddlewareAccessDeniedFallback: React.FC<{
  result: RouteProtectionResult | null;
}> = ({ result }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="mx-auto max-w-md p-6 text-center">
      <div className="mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 13.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600">
          {result?.reason || "You do not have permission to access this page."}
        </p>
      </div>
      <button
        onClick={() => window.history.back()}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * Default redirecting component
 */
const MiddlewareRedirectingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="mx-auto mb-4 h-8 w-8 rounded-full bg-blue-600"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  </div>
);
