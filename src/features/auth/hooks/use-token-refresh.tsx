"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTokenStore } from "../state/store/token.store";
import { httpClient } from "../../../lib/http-client";

interface UseTokenRefreshOptions {
  refreshThresholdMinutes?: number;
  autoRefreshInterval?: number;
  enableAutoRefresh?: boolean;
}

/**
 * @deprecated This hook is deprecated in favor of automatic token refresh via HTTP interceptors.
 *
 * Token refresh is now handled automatically by HTTP interceptors when API calls return 401.
 * The interceptors use HTTP-only cookies for secure refresh token management.
 *
 * This hook is maintained for backward compatibility but will be removed in a future version.
 * Consider removing calls to this hook from your components.
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    refreshThresholdMinutes = 5,
    autoRefreshInterval = 60000, // 1 minute
    enableAutoRefresh = true,
  } = options;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isAuthenticated, getAccessToken, user } = useTokenStore();

  // Show deprecation warning in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "useTokenRefresh is deprecated. Token refresh is now handled automatically by HTTP interceptors. Consider removing this hook from your components.",
      );
    }
  }, []);

  /**
   * @deprecated Manual token refresh function - no longer needed
   * Token refresh is now handled automatically by HTTP interceptors
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    console.warn(
      "Manual token refresh is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );

    // Return true if we have a valid token, indicating "refresh not needed"
    return !!getAccessToken();
  }, [getAccessToken]);

  /**
   * @deprecated Token expiration checking is no longer needed on client-side
   * The server validates tokens and HTTP interceptors handle refresh automatically
   */
  const needsRefresh = useCallback((): boolean => {
    console.warn(
      "Client-side token expiration checking is deprecated. Token validation is now handled server-side.",
    );

    // Always return false since refresh is handled automatically
    return false;
  }, []);

  /**
   * @deprecated Force refresh is no longer needed
   * HTTP interceptors handle refresh automatically when needed
   */
  const forceRefresh = useCallback(async (): Promise<boolean> => {
    console.warn(
      "Force refresh is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );

    return !!getAccessToken();
  }, [getAccessToken]);

  /**
   * Get current authentication status
   * This is the only method that remains useful in the new system
   */
  const getAuthStatus = useCallback(() => {
    return {
      isAuthenticated: httpClient.isAuthenticated(),
      hasToken: !!getAccessToken(),
      user: user,
    };
  }, [getAccessToken, user]);

  /**
   * @deprecated Auto-refresh is no longer needed
   * HTTP interceptors handle refresh automatically
   */
  useEffect(() => {
    if (!enableAutoRefresh || !isAuthenticated) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Auto-refresh interval is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
      );
    }

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // We no longer need to set up refresh intervals
    // HTTP interceptors handle refresh automatically

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enableAutoRefresh, isAuthenticated, autoRefreshInterval]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    refreshToken,
    needsRefresh,
    forceRefresh,
    getAuthStatus,
    // Legacy properties for backward compatibility
    isRefreshing: false, // Always false since refresh is handled by interceptors
    lastRefreshTime: null, // No longer tracked client-side
    refreshCount: 0, // No longer tracked client-side
  };
};

export default useTokenRefresh;
