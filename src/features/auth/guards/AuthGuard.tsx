"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../hooks/use-auth-guard";
import { RouteProtectionResult } from "../types/route-protection.types";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ComponentType | React.ReactNode;
  loadingFallback?: React.ComponentType | React.ReactNode;
  unAuthorizedFallback?: React.ComponentType<{ result: RouteProtectionResult }>;
  redirectOnUnauthorized?: boolean;
  onUnauthorized?: (result: RouteProtectionResult) => void;
}

/**
 * AuthGuard Component
 *
 * Protects routes based on authentication status and route configuration.
 * Automatically handles redirects and fallback components.
 */

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  loadingFallback,
  unAuthorizedFallback: UnauthorizedFallback,
  redirectOnUnauthorized = true,
  onUnauthorized,
}) => {
  const { isLoading, isAuthorized, protectionResult } = useAuthGuard({
    redirectOnUnauthorized,
    onUnauthorized,
  });

  if (isLoading) {
    if (loadingFallback) {
      return typeof loadingFallback === "function"
        ? React.createElement(loadingFallback)
        : loadingFallback;
    }

    return <AuthLoadingFallback />;
  }

  if (!isAuthorized && !redirectOnUnauthorized) {
    if (UnauthorizedFallback && protectionResult) {
      return <UnauthorizedFallback result={protectionResult} />;
    }

    if (fallback) {
      return typeof fallback === "function"
        ? React.createElement(fallback)
        : fallback;
    }

    return <AuthUnauthorizedFallback result={protectionResult} />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null;
};

const AuthLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

const AuthUnauthorizedFallback: React.FC<{
  result: RouteProtectionResult | null;
}> = ({ result }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="mb-4 text-gray-600">
          {result?.reason || "You do not have permission to access this page."}
        </p>
        <button
          onClick={() => router.back()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
