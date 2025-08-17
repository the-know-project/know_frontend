"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface SimpleAuthBoundaryProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ComponentType;
}

const DefaultAuthFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900">
        Session Expired
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Your session has expired. Redirecting to login...
      </p>
      <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
    </div>
  </div>
);

export const SimpleAuthBoundary: React.FC<SimpleAuthBoundaryProps> = ({
  children,
  redirectTo = "/login",
  fallback: Fallback = DefaultAuthFallback,
}) => {
  const router = useRouter();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!tokenStore.isAuthenticated || !tokenStore.accessToken) {
      console.warn("Authentication required, redirecting");
      setIsRedirecting(true);

      tokenStore.clearAuth();
      roleStore.clearRole();

      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);

      return;
    }

    const interval = setInterval(() => {
      if (!tokenStore.isAuthenticated || !tokenStore.accessToken) {
        console.warn("Auth state lost during session, redirecting");
        setIsRedirecting(true);

        tokenStore.clearAuth();
        roleStore.clearRole();

        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      }
    }, 30000);

    const unsubscribe = useTokenStore.subscribe((state) => {
      if (!state.isAuthenticated && !isRedirecting) {
        console.warn("Auth state lost, redirecting");
        setIsRedirecting(true);

        tokenStore.clearAuth();
        roleStore.clearRole();

        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [router, redirectTo, tokenStore, roleStore, isRedirecting]);

  if (isRedirecting) {
    return <Fallback />;
  }

  if (!tokenStore.isAuthenticated || !tokenStore.accessToken) {
    return <Fallback />;
  }

  return <>{children}</>;
};
