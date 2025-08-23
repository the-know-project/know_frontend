"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { useRoleStore, useTokenStore } from "../state/store";
import { httpClient } from "../../../lib/http-client";
import GradientText from "@/src/shared/components/gradient-text";

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
  clearError: () => void;
  retry: () => Promise<void>;
  logout: () => Promise<void>;
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
            type="button"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            type="button"
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
  publicRoutes = ["/login", "/register", "/", "/role", "/about", "/contact"],
  redirectTo = "/login",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const roleStore = useRoleStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const attemptSilentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔄 Attempting silent refresh...");

      const refreshResponse = await httpClient.attemptPublicSilentRefresh();

      if (
        refreshResponse.success &&
        refreshResponse.accessToken &&
        refreshResponse.user
      ) {
        console.log("✅ Silent refresh successful");

        auth.login(
          refreshResponse.accessToken,
          refreshResponse.user,
          refreshResponse.role || roleStore.role,
        );

        return true;
      }

      console.log("❌ Silent refresh failed:", refreshResponse.error);
      return false;
    } catch (error) {
      console.log("❌ Silent refresh failed with error:", error);
      return false;
    }
  }, [auth, roleStore.role]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!hasHydrated) {
        console.log("⏳ Waiting for store hydration...");
        return;
      }

      // const isAuthenticated = httpClient.isAuthenticated();
      const isAuthenticated = true;

      if (!isAuthenticated && !isPublicRoute) {
        console.log("🔄 No access token found, attempting silent refresh...");

        const refreshSuccess = await attemptSilentRefresh();

        if (!refreshSuccess) {
          console.log("❌ Silent refresh failed, redirecting to login");
          router.push(redirectTo);
          return;
        }
      }

      if (httpClient.isAuthenticated() && !auth.user) {
        try {
          await httpClient.get("/api/auth/me");
        } catch (authError) {
          console.warn("⚠️ Auth verification failed:", authError);
          return;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication check failed";
      console.error("❌ Auth status check failed:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, [
    auth.user,
    isPublicRoute,
    redirectTo,
    router,
    attemptSilentRefresh,
    hasHydrated,
  ]);

  const retry = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await auth.logout();
      roleStore.clearRole();
      router.push("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [auth, roleStore, router]);

  useEffect(() => {
    if (!hasInitialized && hasHydrated) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, hasInitialized, hasHydrated]);

  useEffect(() => {
    if (
      hasInitialized &&
      hasHydrated &&
      !isPublicRoute &&
      !auth.isAuthenticated &&
      !isLoading
    ) {
      console.log(
        "🔄 Route change detected - redirecting unauthenticated user",
      );
      router.push(redirectTo);
    }
  }, [
    pathname,
    isPublicRoute,
    auth.isAuthenticated,
    hasInitialized,
    hasHydrated,
    isLoading,
    router,
    redirectTo,
  ]);

  useEffect(() => {
    if (error && error.includes("refresh_token_invalid")) {
      console.log(
        "🚨 Critical auth error detected, clearing state and redirecting",
      );
      auth.logout();
      roleStore.clearRole();
      router.push(redirectTo);
    }
  }, [error, auth, roleStore, router, redirectTo]);

  const shouldShowFallback =
    !isPublicRoute &&
    error &&
    hasInitialized &&
    (error.includes("refresh_token_invalid") ||
      error.includes("No authentication token") ||
      error.includes("Session expired"));

  if (shouldShowFallback) {
    return <Fallback error={error} retry={retry} isLoading={isLoading} />;
  }

  if (!isPublicRoute && (isLoading || !hasInitialized || !hasHydrated)) {
    return <Fallback error={null} retry={retry} isLoading={true} />;
  }

  const contextValue: AuthContextValue = {
    isAuthenticated: auth.isAuthenticated,
    isLoading,
    user: auth.user,
    role: roleStore.role,
    error,
    clearError,
    retry,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <DebugAuthInfo
          isAuthenticated={auth.isAuthenticated}
          hasAccessToken={!!auth.accessToken}
          user={auth.user}
          role={roleStore.role}
          hasInitialized={hasInitialized}
          isLoading={isLoading}
          error={error}
        />
      )}
    </AuthContext.Provider>
  );
};

const DebugAuthInfo: React.FC<{
  isAuthenticated: boolean;
  hasAccessToken: boolean;
  user: any;
  role: string | null;
  hasInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}> = ({
  isAuthenticated,
  hasAccessToken,
  user,
  role,
  hasInitialized,
  isLoading,
  error,
}) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed right-4 bottom-4 z-50 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-50 hover:opacity-100"
        type="button"
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
          type="button"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
        <div>Has Token: {hasAccessToken ? "✅" : "❌"}</div>
        <div>Has User: {user ? "✅" : "❌"}</div>
        <div>Role: {role || "None"}</div>
        <div>Initialized: {hasInitialized ? "✅" : "❌"}</div>
        <div>Loading: {isLoading ? "🔄" : "✅"}</div>
        <div>Error: {error ? "❌" : "✅"}</div>
        {error && (
          <div className="mt-1 text-xs break-words text-red-300">{error}</div>
        )}
      </div>
      <button
        onClick={() =>
          console.table({
            isAuthenticated,
            hasAccessToken,
            user,
            role,
            hasInitialized,
            isLoading,
            error,
          })
        }
        className="mt-2 w-full rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
        type="button"
      >
        Log Full State
      </button>
    </div>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// Legacy export for backward compatibility
export const EnhancedAuthProvider = AuthProvider;
export const useEnhancedAuthContext = useAuthContext;
