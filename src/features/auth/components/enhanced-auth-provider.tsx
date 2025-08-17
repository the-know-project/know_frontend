"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEnhancedAuthStatus } from "../hooks/use-enhanced-auth-status";
import { useTokenStore } from "../state/store";
import { useRoleStore } from "../state/store";
import { EnhancedTokenUtils } from "../utils/enhanced-token.utils";
import GradientText from "@/src/shared/components/gradient-text";

interface EnhancedAuthContextValue {
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
  tokenInfo: ReturnType<typeof EnhancedTokenUtils.getTokenInfo>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  retry: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextValue | undefined>(
  undefined,
);

interface EnhancedAuthProviderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: string | null;
    retry: () => void;
    isLoading: boolean;
  }>;
  publicRoutes?: string[];
  redirectTo?: string;
  enableAutoRefresh?: boolean;
  refreshThresholdMinutes?: number;
  checkInterval?: number;
}

const DefaultAuthFallback: React.FC<{
  error: string | null;
  retry: () => void;
  isLoading: boolean;
}> = ({ error, retry, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="gradient-glow text-center">
          <GradientText>
            <h3 className="font-bebas text-4xl tracking-wider">
              Are you in the know?
            </h3>
          </GradientText>
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

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({
  children,
  fallback: Fallback = DefaultAuthFallback,
  publicRoutes = ["/login", "/register", "/", "/role", "/about", "/contact"],
  redirectTo = "/login",
  enableAutoRefresh = true,
  refreshThresholdMinutes = 15,
  checkInterval = 10 * 60 * 1000, // 10 minutes
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const tokenStore = useTokenStore();
  const roleStore = useRoleStore();

  const [retryKey, setRetryKey] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [forceShowContent, setForceShowContent] = useState(false);

  const handleAuthError = (errorMessage: string) => {
    router.push("/login");
  };

  const handleTokenRefreshed = () => {
    console.log("✅ Token refreshed successfully");
    setRetryKey((prev) => prev + 1);
  };

  const {
    isAuthenticated,
    isLoading,
    user,
    role,
    error,
    isTokenExpired,
    tokenInfo,
    refreshTokens,
    clearError,
    retry,
  } = useEnhancedAuthStatus({
    redirectOnAuthFailure: false,
    redirectTo,
    onAuthError: handleAuthError,
    onTokenRefreshed: handleTokenRefreshed,
    enableAutoRefresh,
    refreshThresholdMinutes,
    checkInterval,
  });

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !hasInitialized) {
        console.warn(
          "⚠️ Auth loading timeout reached, forcing content display",
        );
        setForceShowContent(true);
        setHasInitialized(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading, hasInitialized]);

  useEffect(() => {
    if (!hasInitialized && !isLoading) {
      setHasInitialized(true);
      return;
    }

    if (!hasInitialized && !forceShowContent) return;

    if (!isPublicRoute && !isAuthenticated && !isLoading) {
      console.log(
        "🔄 Redirecting to login - not authenticated on protected route",
      );
      router.push(redirectTo);
      return;
    }

    if (error && error.includes("refresh_token_invalid")) {
      console.log("🚨 Critical auth error, clearing state and redirecting");
      tokenStore.clearAuth();
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
    tokenStore,
    roleStore,
  ]);

  const handleRetry = async () => {
    clearError();
    setRetryKey((prev) => prev + 1);
    await retry();
  };

  const shouldShowFallback =
    !isPublicRoute &&
    error &&
    hasInitialized &&
    (error.includes("refresh_token_invalid") ||
      error.includes("No authentication token") ||
      error.includes("Session expired"));

  if (shouldShowFallback) {
    return <Fallback error={error} retry={handleRetry} isLoading={isLoading} />;
  }

  if (!isPublicRoute && (isLoading || !hasInitialized) && !forceShowContent) {
    return <Fallback error={null} retry={handleRetry} isLoading={true} />;
  }

  const contextValue: EnhancedAuthContextValue = {
    isAuthenticated,
    isLoading,
    user,
    role: role,
    error,
    isTokenExpired,
    tokenInfo,
    refreshTokens,
    clearError,
    retry: handleRetry,
  };

  return (
    <EnhancedAuthContext.Provider value={contextValue}>
      <div key={retryKey}>
        {children}
        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <DebugAuthInfo
            tokenInfo={tokenInfo}
            isTokenStoreRehydrated={tokenStore.hasHydrated}
            isRoleStoreRehydrated={roleStore.hasHydrated}
            hasInitialized={hasInitialized}
            forceShowContent={forceShowContent}
            isLoading={isLoading}
          />
        )}
      </div>
    </EnhancedAuthContext.Provider>
  );
};

const DebugAuthInfo: React.FC<{
  tokenInfo: ReturnType<typeof EnhancedTokenUtils.getTokenInfo>;
  isTokenStoreRehydrated: boolean;
  isRoleStoreRehydrated: boolean;
  hasInitialized: boolean;
  forceShowContent: boolean;
  isLoading: boolean;
}> = ({
  tokenInfo,
  isTokenStoreRehydrated,
  isRoleStoreRehydrated,
  hasInitialized,
  forceShowContent,
  isLoading,
}) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed right-4 bottom-4 z-50 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-50 hover:opacity-100"
      >
        🔐
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded bg-gray-800 p-3 text-xs text-white shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">Auth Debug</span>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>Token: {tokenInfo.hasToken ? "✅" : "❌"}</div>
        <div>Valid: {tokenInfo.isValid ? "✅" : "❌"}</div>
        <div>Expires in: {tokenInfo.timeUntilExpiryMinutes || 0}m</div>
        <div>Will expire soon: {tokenInfo.willExpireSoon ? "⚠️" : "✅"}</div>
        <div>User active: {tokenInfo.isUserActive ? "✅" : "💤"}</div>
        <div>Refresh count: {tokenInfo.refreshCount || 0}</div>
        <div className="mt-2 border-t border-gray-600 pt-2">
          <div>Token Store: {isTokenStoreRehydrated ? "✅" : "❌"}</div>
          <div>Role Store: {isRoleStoreRehydrated ? "✅" : "❌"}</div>
          <div>Initialized: {hasInitialized ? "✅" : "❌"}</div>
          <div>Force Show: {forceShowContent ? "⚠️" : "❌"}</div>
          <div>Loading: {isLoading ? "🔄" : "✅"}</div>
        </div>
      </div>
      <button
        onClick={() => EnhancedTokenUtils.debugTokenState()}
        className="mt-2 w-full rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
      >
        Log Full State
      </button>
    </div>
  );
};

export const useEnhancedAuthContext = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error(
      "useEnhancedAuthContext must be used within an EnhancedAuthProvider",
    );
  }
  return context;
};
