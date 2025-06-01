import React from "react";
import { AuthGuard } from "./AuthGuard";
import { RouteProtectionResult } from "../types/route-protection.types";

interface WithAuthGuardOptions {
  redirectOnUnauthorized?: boolean;
  fallback?: React.ComponentType | React.ReactNode;
  loadingFallback?: React.ComponentType | React.ReactNode;
  onUnauthorized?: (result: RouteProtectionResult) => void;
}

/**
 * Higher-Order Component for route protection
 *
 * Usage:
 * const ProtectedComponent = withAuthGuard(MyComponent, { requiresAuth: true });
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthGuardOptions = {},
) {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
