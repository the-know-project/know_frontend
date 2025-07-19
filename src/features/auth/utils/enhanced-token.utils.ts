import { tokenService } from "../service/token.service";
import { useTokenStore } from "../state/store";

interface RefreshResult {
  success: boolean;
  error?: string;
  shouldLogout?: boolean;
}

interface ActivityTracker {
  lastActivity: number;
  lastRefresh: number;
  refreshCount: number;
  isUserActive: boolean;
}

export class EnhancedTokenUtils {
  private static tokenStore = useTokenStore.getState();
  private static isRefreshing = false;
  private static refreshPromise: Promise<RefreshResult> | null = null;
  private static activityTracker: ActivityTracker = {
    lastActivity: Date.now(),
    lastRefresh: 0,
    refreshCount: 0,
    isUserActive: true,
  };

  // Track user activity
  static initActivityTracking() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const updateActivity = () => {
      this.activityTracker.lastActivity = Date.now();
      this.activityTracker.isUserActive = true;
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check if user is inactive after 5 minutes of no activity
    setInterval(() => {
      const timeSinceActivity = Date.now() - this.activityTracker.lastActivity;
      this.activityTracker.isUserActive = timeSinceActivity < 5 * 60 * 1000; // 5 minutes
    }, 60000); // Check every minute
  }

  static isAuthenticated(): boolean {
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();

    if (!accessToken || !refreshToken) return false;

    const validation = tokenService.validateToken(accessToken);
    return validation.isValid;
  }

  static async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();
    const user = this.tokenStore.user;

    if (!accessToken || !refreshToken || !user) {
      return null;
    }

    const validation = tokenService.validateToken(accessToken);

    if (validation.isValid) {
      return accessToken;
    }

    // Token is expired, attempt refresh
    const refreshResult = await this.attemptRefresh();

    if (refreshResult.success) {
      return this.tokenStore.getAccessToken();
    }

    return null;
  }

  static async attemptRefresh(force = false): Promise<RefreshResult> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();
    const user = this.tokenStore.user;

    if (!refreshToken || !user) {
      return { success: false, error: "No refresh token available", shouldLogout: true };
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

    this.refreshPromise = this.performRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private static async performRefresh(refreshToken: string): Promise<RefreshResult> {
    try {
      console.log('🔄 Attempting token refresh...');

      const refreshResponse = await tokenService.refreshWithRetry(refreshToken, 3);

      if (refreshResponse.status === 200 && refreshResponse.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: updatedUser,
        } = refreshResponse.data;

        this.tokenStore.setTokens(newAccessToken, newRefreshToken, updatedUser);

        this.activityTracker.lastRefresh = Date.now();
        this.activityTracker.refreshCount++;

        console.log('✅ Token refresh successful');
        return { success: true };
      } else {
        console.error('❌ Token refresh failed: Invalid response');
        return {
          success: false,
          error: "Invalid refresh response",
          shouldLogout: true
        };
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);

      // Check if it's an authentication error (refresh token expired)
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          success: false,
          error: "Refresh token expired",
          shouldLogout: true
        };
      }

      // For network errors or other issues, don't logout immediately
      return {
        success: false,
        error: error.message || "Network error during refresh",
        shouldLogout: false
      };
    }
  }

  static async smartRefresh(): Promise<RefreshResult> {
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return { success: false, error: "No tokens available", shouldLogout: true };
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
    const refreshToken = this.tokenStore.getRefreshToken();

    if (refreshToken) {
      try {
        await tokenService.revokeRefreshToken(refreshToken);
        console.log('✅ Server logout successful');
      } catch (error) {
        console.error('❌ Server logout failed:', error);
        // Continue with local logout even if server logout fails
      }
    }

    this.tokenStore.clearTokens();
    this.activityTracker = {
      lastActivity: Date.now(),
      lastRefresh: 0,
      refreshCount: 0,
      isUserActive: true,
    };

    console.log('🚪 Local logout completed');
  }

  static shouldAttemptRefresh(): boolean {
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();

    if (!accessToken || !refreshToken) {
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
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();

    if (!accessToken) {
      return { hasToken: false };
    }

    const validation = tokenService.validateToken(accessToken);
    const timeUntilExpiry = validation.payload ?
      Math.max(0, validation.payload.exp - Date.now() / 1000) : 0;

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
if (typeof window !== 'undefined') {
  EnhancedTokenUtils.initActivityTracking();
}
