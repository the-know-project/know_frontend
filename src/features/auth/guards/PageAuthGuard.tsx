"use client";

import { AuthGuard } from "./AuthGuard";

interface PageAuthGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  guestOnly?: boolean;
  requiredRoles?: string[];
  customFallback?: React.ReactNode | React.ComponentType;
}

export const PageAuthGuard: React.FC<PageAuthGuardProps> = ({
  children,
  requiresAuth = false,
  guestOnly = false,
  customFallback,
}) => {
  if (!requiresAuth && !guestOnly) {
    return <>{children}</>;
  }

  return (
    <AuthGuard fallback={customFallback} loadingFallback={PageLoadingFallback}>
      {children}
    </AuthGuard>
  );
};

const PageLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="mx-auto mb-4 h-8 w-32 rounded bg-gray-300"></div>
        <div className="mx-auto h-4 w-48 rounded bg-gray-300"></div>
      </div>
    </div>
  </div>
);
