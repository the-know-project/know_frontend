"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "../hooks";
import { AUTH_REDIRECT_CONFIG } from "../config/route-protection.config";
import { useEffect } from "react";
import GradientText from "@/src/shared/components/gradient-text";

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
  <div className="flex min-h-screen items-center justify-center bg-neutral-900">
    <div className="gradient-glow text-center">
      {/* <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div> */}
      <GradientText>
        <h3 className="font-bebas text-4xl tracking-wider">
          Are you in the know?
        </h3>
      </GradientText>
    </div>
  </div>
);
