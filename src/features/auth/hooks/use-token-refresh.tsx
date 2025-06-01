import { useCallback, useEffect, useRef } from "react";
import { useTokenStore } from "../state/store/token.store";

import { TokenUtils } from "../utils/token.utils";
import { tokenService } from "../service/token.service";

interface UseTokenRefreshOptions {
  refreshThresholdMinutes?: number;
  autoRefreshInterval?: number;
  enableAutoRefresh?: boolean;
}

export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    refreshThresholdMinutes = 5,
    autoRefreshInterval = 60000, // 1 minute
    enableAutoRefresh = true,
  } = options;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isAuthenticated, getAccessToken, user } = useTokenStore();

  /**
   * Manual token refresh function
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const result = await TokenUtils.refreshIfNeeded(refreshThresholdMinutes);
    return result;
  }, [refreshThresholdMinutes]);

  /**
   * Check if current token needs refresh
   */
  const needsRefresh = useCallback((): boolean => {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    return tokenService.willExpireSoon(accessToken, refreshThresholdMinutes);
  }, [getAccessToken, refreshThresholdMinutes]);

  /**
   * Get time until token expires (in seconds)
   */
  const getTimeUntilExpiry = useCallback((): number | null => {
    const accessToken = getAccessToken();
    if (!accessToken) return null;

    const validation = tokenService.validateToken(accessToken);
    if (!validation.isValid || !validation.payload) return null;

    const currentTime = Date.now() / 1000;
    return Math.max(0, validation.payload.exp - currentTime);
  }, [getAccessToken]);



  // Set up automatic refresh interval
  useEffect(() => {
    if (!enableAutoRefresh || !isAuthenticated || !user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const interval = setInterval(async () => {
      await TokenUtils.refreshIfNeeded(refreshThresholdMinutes);
    }, autoRefreshInterval);

    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isAuthenticated,
    enableAutoRefresh,
    autoRefreshInterval,
    refreshThresholdMinutes,
    user,
  ]);

  return {
    refreshToken,
    needsRefresh,
    getTimeUntilExpiry,
  };
};
