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
  <div className="flex min-h-screen w-full items-center justify-center bg-transparent blur-lg"></div>
);
