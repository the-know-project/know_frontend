"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "../hooks";
import { AUTH_REDIRECT_CONFIG } from "../config/route-protection.config";
import { useEffect } from "react";

interface HomePageGuardProps {
  children: React.ReactNode;
  loadingComponent?: React.ComponentType;
}

export const HomePageGuard: React.FC<HomePageGuardProps> = ({
  children,
  loadingComponent: LoadingComponent,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    // Only redirect if we're sure the user is authenticated
    if (!isLoading && isAuthenticated) {
      router.push(AUTH_REDIRECT_CONFIG.authenticatedUserDefaultRoute);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return <HomePageLoadingFallback />;
  }

  if (isAuthenticated) {
    return <HomePageLoadingFallback />;
  }

  return <>{children}</>;
};

const HomePageLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);
