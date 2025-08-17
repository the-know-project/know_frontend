"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ retry: () => void }>;
  redirectTo?: string;
}

interface AuthErrorState {
  hasError: boolean;
  errorType: "token_expired" | "auth_failed" | "unknown";
  retryCount: number;
}

const DefaultFallback: React.FC<{ retry: () => void }> = ({ retry }) => (
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
        Your session has expired. Please log in again to continue.
      </p>
      <button
        onClick={retry}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        Try Again
      </button>
    </div>
  </div>
);

export const AuthErrorBoundary: React.FC<AuthErrorBoundaryProps> = ({
  children,
  fallback: Fallback = DefaultFallback,
  redirectTo = "/login",
}) => {
  const router = useRouter();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const [errorState, setErrorState] = useState<AuthErrorState>({
    hasError: false,
    errorType: "unknown",
    retryCount: 0,
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Monitor token store for sudden auth state changes
  useEffect(() => {
    let previousAuthenticated = tokenStore.isAuthenticated;

    const unsubscribe = useTokenStore.subscribe((state) => {
      const currentAuthenticated = state.isAuthenticated;

      // If user was authenticated but now isn't, and it's not initial load
      if (previousAuthenticated && !currentAuthenticated && !isCheckingAuth) {
        console.warn(
          "Auth state changed unexpectedly - token may have expired",
        );
        setErrorState({
          hasError: true,
          errorType: "token_expired",
          retryCount: 0,
        });
      }

      previousAuthenticated = currentAuthenticated;
    });

    return unsubscribe;
  }, [isCheckingAuth, tokenStore.isAuthenticated]);

  // Monitor for token expiration
  useEffect(() => {
    if (!tokenStore.isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (!tokenStore.accessToken && tokenStore.isAuthenticated) {
        console.warn("Token missing detected");
        setErrorState({
          hasError: true,
          errorType: "token_expired",
          retryCount: 0,
        });
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up periodic checks
    const interval = setInterval(checkTokenExpiration, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [tokenStore.isAuthenticated]);

  // Handle retry logic
  const handleRetry = async () => {
    const maxRetries = 2;

    if (errorState.retryCount >= maxRetries) {
      // Clear auth state and redirect to login
      tokenStore.clearAuth();
      roleStore.clearRole();
      router.push(redirectTo);
      return;
    }

    setIsCheckingAuth(true);
    setErrorState((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }));

    try {
      // Try to refresh the token
      // Token refresh is now handled by HTTP interceptors
      // Just reset error state and let the interceptors handle it
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief delay

      setErrorState({
        hasError: false,
        errorType: "unknown",
        retryCount: 0,
      });
    } catch (error) {
      console.error("Retry failed:", error);

      if (errorState.retryCount + 1 >= maxRetries) {
        // Final attempt failed, redirect to login
        tokenStore.clearAuth();
        roleStore.clearRole();
        router.push(redirectTo);
      } else {
        // Still have retries left
        setErrorState((prev) => ({ ...prev, hasError: true }));
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Reset error state when successfully authenticated
  useEffect(() => {
    if (tokenStore.isAuthenticated && tokenStore.accessToken) {
      setErrorState({
        hasError: false,
        errorType: "unknown",
        retryCount: 0,
      });
    }
  }, [tokenStore.isAuthenticated]);

  if (errorState.hasError && !isCheckingAuth) {
    return <Fallback retry={handleRetry} />;
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
          <p className="text-sm text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
