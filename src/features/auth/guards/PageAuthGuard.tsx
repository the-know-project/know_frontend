"use client";

import { useTokenStore } from "../state/store";
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
  requiredRoles,
}) => {
  const user = useTokenStore((state) => state.user);
  const isRoleAllowed = requiredRoles
    ? requiredRoles.includes(user?.role || "")
    : true;
  if (!requiresAuth && !guestOnly && isRoleAllowed) {
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
