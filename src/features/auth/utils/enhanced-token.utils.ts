import { tokenService } from "../service/token.service";
import { useTokenStore } from "../state/store";

interface RefreshResult {
  success: boolean;
  error?: string;
  shouldLogout?: boolean;
  retryable?: boolean;
  errorType?: "auth" | "network" | "server" | "unknown";
}

interface ActivityTracker {
  lastActivity: number;
  lastRefresh: number;
  refreshCount: number;
  isUserActive: boolean;
  retryCount: number;
  lastRetryTime: number;
}

export class EnhancedTokenUtils {
  private static getTokenStore() {
    return useTokenStore.getState();
  }
  private static isRefreshing = false;
  private static refreshPromise: Promise<RefreshResult> | null = null;
  private static activityTracker: ActivityTracker = {
    lastActivity: Date.now(),
    lastRefresh: 0,
    refreshCount: 0,
    isUserActive: true,
    retryCount: 0,
    lastRetryTime: 0,
  };

  // Track user activity
  static initActivityTracking() {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const updateActivity = () => {
      this.activityTracker.lastActivity = Date.now();
      this.activityTracker.isUserActive = true;
    };

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check if user is inactive after 5 minutes of no activity
    setInterval(
      () => {
        const timeSinceActivity =
          Date.now() - this.activityTracker.lastActivity;
        this.activityTracker.isUserActive = timeSinceActivity < 30 * 60 * 1000; // 30 minutes
      },
      15 * 60 * 1000,
    ); // Check every 15 minutes
  }

  static isAuthenticated(): boolean {
    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();
    const user = tokenStore.user;

    if (!accessToken || !refreshToken || !user || !user.id) return false;

    const validation = tokenService.validateToken(accessToken);
    return validation.isValid;
  }

  static async getValidAccessToken(): Promise<string | null> {
    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();
    const user = tokenStore.user;

    if (!accessToken || !refreshToken || !user || !user.id) {
      return null;
    }

    const validation = tokenService.validateToken(accessToken);

    if (validation.isValid) {
      return accessToken;
    }

    // Token is expired, attempt refresh
    const refreshResult = await this.attemptRefresh();

    if (refreshResult.success) {
      return this.getTokenStore().getAccessToken();
    }

    return null;
  }

  static async attemptRefresh(force = false): Promise<RefreshResult> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();
    const user = tokenStore.user;

    if (!refreshToken || !user || !user.id) {
      return {
        success: false,
        error: !user?.id ? "No user ID found" : "No refresh token available",
        shouldLogout: true,
        retryable: false,
        errorType: "auth",
      };
    }

    // Check if we need to refresh
    if (!force && accessToken) {
      const validation = tokenService.validateToken(accessToken);
      if (validation.isValid && !tokenService.willExpireSoon(accessToken, 10)) {
        return { success: true };
      }
    }

    // Prevent multiple simultaneous refresh attempts
    this.isRefreshing = true;

    this.refreshPromise = this.performRefreshWithRetry(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private static async performRefreshWithRetry(
    refreshToken: string,
  ): Promise<RefreshResult> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.performRefresh(refreshToken);

      if (result.success) {
        return result;
      }

      // If not retryable (auth errors), return immediately
      if (!result.retryable || result.shouldLogout) {
        return result;
      }

      if (attempt === maxRetries) {
        console.warn(
          `❌ Token refresh failed after ${maxRetries} attempts - logout required`,
        );
        return {
          ...result,
          shouldLogout: true,
          error: `Token refresh failed after ${maxRetries} attempts`,
        };
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      console.log(
        `⏳ Retrying token refresh in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`,
      );

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // This should never be reached, but just in case
    return {
      success: false,
      error: "Unexpected error in retry logic",
      shouldLogout: true,
      retryable: false,
      errorType: "unknown",
    };
  }

  private static async performRefresh(
    refreshToken: string,
  ): Promise<RefreshResult> {
    try {
      console.log("🔄 Attempting token refresh silently...");

      const refreshResponse = await tokenService.refreshWithRetry(
        refreshToken,
        3,
      );

      if (refreshResponse.status === 200 && refreshResponse.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: updatedUser,
        } = refreshResponse.data;

        this.getTokenStore().setTokens(
          newAccessToken,
          newRefreshToken,
          updatedUser,
        );

        this.activityTracker.lastRefresh = Date.now();
        this.activityTracker.refreshCount++;
        this.activityTracker.retryCount = 0; // Reset retry count on success

        console.log("✅ Token refresh successful (silent)");
        return {
          success: true,
          errorType: undefined,
        };
      } else {
        console.warn(
          "⚠️ Token refresh failed: Invalid response (will retry silently)",
        );
        return {
          success: false,
          error: "Invalid refresh response",
          shouldLogout: false,
          retryable: true,
          errorType: "server",
        };
      }
    } catch (error: any) {
      const errorStatus = error.response?.status;
      const errorMessage = error.message || "Unknown error during refresh";

      // Determine error type and whether we should logout
      if (errorStatus === 401 || errorStatus === 403) {
        console.error("❌ Refresh token expired or invalid - logout required");
        return {
          success: false,
          error: "Refresh token expired",
          shouldLogout: true,
          retryable: false,
          errorType: "auth",
        };
      }

      // Network errors or 5xx server errors - retryable
      if (
        !errorStatus ||
        errorStatus >= 500 ||
        error.code === "NETWORK_ERROR"
      ) {
        console.warn(
          "⚠️ Network/server error during token refresh (will retry silently)",
        );
        return {
          success: false,
          error: errorMessage,
          shouldLogout: false,
          retryable: true,
          errorType: "network",
        };
      }

      // Other 4xx errors (except 401/403) - might be retryable
      if (errorStatus >= 400 && errorStatus < 500) {
        console.warn(
          "⚠️ Client error during token refresh (will retry silently)",
        );
        return {
          success: false,
          error: errorMessage,
          shouldLogout: false,
          retryable: true,
          errorType: "server",
        };
      }

      // Unknown errors - treat as retryable initially
      console.warn(
        "⚠️ Unknown error during token refresh (will retry silently)",
      );
      return {
        success: false,
        error: errorMessage,
        shouldLogout: false,
        retryable: true,
        errorType: "unknown",
      };
    }
  }

  static async smartRefresh(): Promise<RefreshResult> {
    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();
    const user = tokenStore.user;

    if (!accessToken || !refreshToken || !user || !user.id) {
      return {
        success: false,
        error: !user?.id ? "No user ID found" : "No tokens available",
        shouldLogout: true,
        retryable: false,
        errorType: "auth",
      };
    }

    // Only refresh if user is active or token will expire soon
    const willExpireSoon = tokenService.willExpireSoon(accessToken, 15); // 15 minutes threshold
    const isUserActive = this.activityTracker.isUserActive;
    const timeSinceLastRefresh = Date.now() - this.activityTracker.lastRefresh;
    const minRefreshInterval = 5 * 60 * 1000; // Don't refresh more than once every 5 minutes

    // Skip refresh if:
    // - User is inactive and token isn't expiring soon
    // - We refreshed recently
    if (!isUserActive && !willExpireSoon) {
      return { success: true };
    }

    if (timeSinceLastRefresh < minRefreshInterval && !willExpireSoon) {
      return { success: true };
    }

    return this.attemptRefresh();
  }

  static async logout(): Promise<void> {
    const refreshToken = this.getTokenStore().getRefreshToken();

    if (refreshToken) {
      try {
        await tokenService.revokeRefreshToken(refreshToken);
        console.log("✅ Server logout successful");
      } catch (error) {
        console.error("❌ Server logout failed:", error);
        // Continue with local logout even if server logout fails
      }
    }

    this.getTokenStore().clearTokens();
    this.activityTracker = {
      lastActivity: Date.now(),
      lastRefresh: 0,
      refreshCount: 0,
      isUserActive: true,
      retryCount: 0,
      lastRetryTime: 0,
    };

    console.log("🚪 Local logout completed");
  }

  static shouldAttemptRefresh(): boolean {
    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();
    const user = tokenStore.user;

    if (!accessToken || !refreshToken || !user || !user.id) {
      return false;
    }

    // Don't attempt refresh if we're already refreshing
    if (this.isRefreshing) {
      return false;
    }

    const validation = tokenService.validateToken(accessToken);

    // If token is valid and not expiring soon, no refresh needed
    if (validation.isValid && !tokenService.willExpireSoon(accessToken, 10)) {
      return false;
    }

    return true;
  }

  static getTokenInfo() {
    const tokenStore = this.getTokenStore();
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();

    if (!accessToken) {
      return {
        hasToken: false,
        isValid: false,
        isExpired: true,
        timeUntilExpirySeconds: 0,
        timeUntilExpiryMinutes: 0,
        hasRefreshToken: !!refreshToken,
        willExpireSoon: false,
        lastRefresh: this.activityTracker.lastRefresh,
        refreshCount: this.activityTracker.refreshCount,
        isUserActive: this.activityTracker.isUserActive,
        retryCount: this.activityTracker.retryCount,
        lastRetryTime: this.activityTracker.lastRetryTime,
      };
    }

    const validation = tokenService.validateToken(accessToken);
    const timeUntilExpiry = validation.payload
      ? Math.max(0, validation.payload.exp - Date.now() / 1000)
      : 0;

    return {
      hasToken: true,
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      timeUntilExpirySeconds: timeUntilExpiry,
      timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / 60),
      hasRefreshToken: !!refreshToken,
      willExpireSoon: tokenService.willExpireSoon(accessToken, 10),
      lastRefresh: this.activityTracker.lastRefresh,
      refreshCount: this.activityTracker.refreshCount,
      isUserActive: this.activityTracker.isUserActive,
      retryCount: this.activityTracker.retryCount,
      lastRetryTime: this.activityTracker.lastRetryTime,
    };
  }

  // For debugging
  static debugTokenState() {
    const info = this.getTokenInfo();
    console.table(info);
    return info;
  }
}

// Initialize activity tracking when the module loads
if (typeof window !== "undefined") {
  EnhancedTokenUtils.initActivityTracking();
}
