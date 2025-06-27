"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStableAuthStatus } from "../hooks/use-stable-auth-status";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  } | null;
  role: string | null;
  error: string | null;
  isTokenExpired: boolean;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: string | null;
    retry: () => void;
    isLoading: boolean;
  }>;
  publicRoutes?: string[];
  redirectTo?: string;
}

const DefaultAuthFallback: React.FC<{
  error: string | null;
  retry: () => void;
  isLoading: boolean;
}> = ({ error, retry, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
          <p className="text-sm text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Authentication Error
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          {error || "An authentication error occurred. Please try again."}
        </p>
        <div className="space-x-3">
          <button
            onClick={retry}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  fallback: Fallback = DefaultAuthFallback,
  publicRoutes = ["/login", "/register", "/", "/about", "/contact"],
  redirectTo = "/login",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const [retryKey, setRetryKey] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle auth errors
  const handleAuthError = (errorMessage: string) => {
    console.error("Auth Provider Error:", errorMessage);
  };

  const { isAuthenticated, isLoading, user, role, error, isTokenExpired } =
    useStableAuthStatus({
      redirectOnExpiry: false, // Handle redirection manually
      redirectTo,
      onAuthError: handleAuthError,
    });

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });

  // Handle auth state changes
  useEffect(() => {
    if (!hasInitialized && !isLoading) {
      setHasInitialized(true);
      return;
    }

    if (!hasInitialized) return;

    // If on a protected route and not authenticated
    if (!isPublicRoute && !isAuthenticated && !isLoading) {
      console.log(
        "Redirecting to login - not authenticated on protected route",
      );
      router.push(redirectTo);
      return;
    }

    // If token is expired and we have critical auth errors
    if (isTokenExpired && error && error.includes("refresh_token_invalid")) {
      console.log("Critical auth error, clearing state and redirecting");
      tokenStore.clearTokens();
      roleStore.clearRole();
      router.push(redirectTo);
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    isTokenExpired,
    error,
    isPublicRoute,
    pathname,
    router,
    redirectTo,
    hasInitialized,
  ]);

  // Retry handler
  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  // Show fallback for auth errors on protected routes
  if (!isPublicRoute && error && hasInitialized) {
    return <Fallback error={error} retry={handleRetry} isLoading={isLoading} />;
  }

  // Show loading state for protected routes while checking auth
  if (!isPublicRoute && (isLoading || !hasInitialized)) {
    return <Fallback error={null} retry={handleRetry} isLoading={true} />;
  }

  const contextValue: AuthContextValue = {
    isAuthenticated,
    isLoading,
    user,
    role: role,
    error,
    isTokenExpired,
    retry: handleRetry,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <div key={retryKey}>{children}</div>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
