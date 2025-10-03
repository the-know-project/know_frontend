"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTokenStore } from "../state/store/token.store";
import { httpClient } from "../../../lib/http-client";

interface UseTokenRefreshOptions {
  refreshThresholdMinutes?: number;
  autoRefreshInterval?: number;
  enableAutoRefresh?: boolean;
}

export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    refreshThresholdMinutes = 5,
    autoRefreshInterval = 60000,
    enableAutoRefresh = true,
  } = options;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isAuthenticated, getAccessToken, user } = useTokenStore();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "useTokenRefresh is deprecated. Token refresh is now handled automatically by HTTP interceptors. Consider removing this hook from your components.",
      );
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    console.warn(
      "Manual token refresh is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );

    return !!getAccessToken();
  }, [getAccessToken]);

  const needsRefresh = useCallback((): boolean => {
    console.warn(
      "Client-side token expiration checking is deprecated. Token validation is now handled server-side.",
    );

    return false;
  }, []);

  const forceRefresh = useCallback(async (): Promise<boolean> => {
    console.warn(
      "Force refresh is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );

    return !!getAccessToken();
  }, [getAccessToken]);

  const getAuthStatus = useCallback(() => {
    return {
      isAuthenticated: httpClient.isAuthenticated(),
      hasToken: !!getAccessToken(),
      user: user,
    };
  }, [getAccessToken, user]);

  useEffect(() => {
    if (!enableAutoRefresh || !isAuthenticated) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Auto-refresh interval is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
      );
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enableAutoRefresh, isAuthenticated, autoRefreshInterval]);

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
    isRefreshing: false,
    lastRefreshTime: null,
    refreshCount: 0,
  };
};

export default useTokenRefresh;
