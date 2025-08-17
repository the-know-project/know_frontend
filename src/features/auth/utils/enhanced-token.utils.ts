import { useTokenStore } from "../state/store";
import { httpClient } from "../../../lib/http-client";

interface RefreshResult {
  success: boolean;
  error?: string;
  shouldLogout?: boolean;
  retryable?: boolean;
  errorType?: "auth" | "network" | "server" | "unknown";
}

interface ActivityTracker {
  lastActivity: number;
  isUserActive: boolean;
}

export class EnhancedTokenUtils {
  private static getTokenStore() {
    return useTokenStore.getState();
  }

  private static activityTracker: ActivityTracker = {
    lastActivity: Date.now(),
    isUserActive: true,
  };

  /**
   * Initialize user activity tracking
   * This helps determine if silent refresh should be attempted
   */
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

    // Check if user is inactive after 30 minutes of no activity
    setInterval(
      () => {
        const timeSinceActivity =
          Date.now() - this.activityTracker.lastActivity;
        this.activityTracker.isUserActive = timeSinceActivity < 30 * 60 * 1000; // 30 minutes
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    return httpClient.isAuthenticated();
  }

  /**
   * Get current access token if available
   * @returns string | null - current access token or null
   */
  static async getValidAccessToken(): Promise<string | null> {
    const tokenStore = this.getTokenStore();
    return tokenStore.getAccessToken();
  }

  /**
   * Check if user is currently active
   * @returns boolean indicating if user has been active recently
   */
  static isUserActive(): boolean {
    return this.activityTracker.isUserActive;
  }

  /**
   * Get time since last user activity
   * @returns number - milliseconds since last activity
   */
  static getTimeSinceLastActivity(): number {
    return Date.now() - this.activityTracker.lastActivity;
  }

  /**
   * Attempt token refresh
   * Note: This now delegates to HTTP interceptors with HTTP-only cookies
   * @param silent - whether to attempt silent refresh
   * @returns Promise<RefreshResult>
   */
  static async attemptRefresh(silent: boolean = false): Promise<RefreshResult> {
    try {
      console.log(
        `🔄 EnhancedTokenUtils: Delegating refresh to HTTP interceptors (silent: ${silent})`,
      );

      // Check if user is active for silent refresh
      if (silent && !this.isUserActive()) {
        console.log(
          "⏸️ EnhancedTokenUtils: User inactive, skipping silent refresh",
        );
        return {
          success: false,
          error: "User inactive",
          retryable: true,
          errorType: "unknown",
        };
      }

      // The actual refresh is now handled by HTTP interceptors
      // We just need to trigger a request that will cause a 401 and automatic refresh
      const tokenStore = this.getTokenStore();
      const currentToken = tokenStore.getAccessToken();

      if (!currentToken) {
        return {
          success: false,
          error: "No access token available",
          shouldLogout: true,
          retryable: false,
          errorType: "auth",
        };
      }

      // Since refresh is now automatic via interceptors, we just return current state
      return {
        success: true,
        errorType: "unknown",
      };
    } catch (error) {
      console.error("🔄 EnhancedTokenUtils: Refresh attempt failed:", error);

      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("Network") ||
          error.message.includes("timeout"));

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown refresh error",
        retryable: isNetworkError,
        shouldLogout: !isNetworkError,
        errorType: isNetworkError ? "network" : "auth",
      };
    }
  }

  /**
   * Perform complete logout with server cleanup
   * @returns Promise<void>
   */
  static async logout(): Promise<void> {
    try {
      console.log("🚪 EnhancedTokenUtils: Initiating logout...");
      await httpClient.logout();
      console.log("✅ EnhancedTokenUtils: Logout completed");
    } catch (error) {
      console.error("❌ EnhancedTokenUtils: Logout error:", error);
      // Clear local state anyway
      this.getTokenStore().clearAuth();
    }
  }

  /**
   * Clear local authentication state without server logout
   * Use this when you want to clear local state only
   */
  static clearLocalAuth(): void {
    console.log("🧹 EnhancedTokenUtils: Clearing local auth state");
    this.getTokenStore().clearAuth();
  }

  /**
   * Check if refresh token is available
   * Note: In the new system, refresh tokens are HTTP-only cookies
   * This method checks if we have the necessary auth state to attempt refresh
   * @returns boolean
   */
  static hasRefreshCapability(): boolean {
    const tokenStore = this.getTokenStore();
    return tokenStore.isAuthenticated; // If authenticated, assume refresh capability exists
  }

  /**
   * Get current user data
   * @returns user object or null
   */
  static getUser() {
    return this.getTokenStore().getUser();
  }

  /**
   * Update access token manually
   * This is typically called by HTTP interceptors
   * @param accessToken - new access token
   */
  static updateAccessToken(accessToken: string): void {
    this.getTokenStore().updateAccessToken(accessToken);
  }

  /**
   * @deprecated This method is deprecated. Refresh tokens are now HTTP-only cookies.
   */
  static getRefreshToken(): null {
    console.warn(
      "EnhancedTokenUtils.getRefreshToken() is deprecated. Refresh tokens are now HTTP-only cookies managed by the server.",
    );
    return null;
  }

  /**
   * @deprecated This method is deprecated. Use logout() instead.
   */
  static async revokeTokens(): Promise<void> {
    console.warn(
      "EnhancedTokenUtils.revokeTokens() is deprecated. Use logout() instead.",
    );
    await this.logout();
  }

  /**
   * @deprecated This method is deprecated. Token validation is now server-side.
   */
  static validateToken(): { isValid: boolean } {
    console.warn(
      "EnhancedTokenUtils.validateToken() is deprecated. Token validation is now handled server-side via HTTP interceptors.",
    );
    return { isValid: !!this.getTokenStore().getAccessToken() };
  }

  /**
   * @deprecated This method is deprecated. Token info is simplified in the new system.
   */
  static getTokenInfo() {
    console.warn(
      "EnhancedTokenUtils.getTokenInfo() is deprecated. Token management is now simplified with HTTP interceptors.",
    );

    const tokenStore = this.getTokenStore();
    const hasToken = !!tokenStore.getAccessToken();

    return {
      hasToken,
      isValid: hasToken,
      isExpired: !hasToken,
      timeUntilExpirySeconds: hasToken ? 900 : 0, // Mock 15 minutes
      timeUntilExpiryMinutes: hasToken ? 15 : 0,
      hasRefreshToken: tokenStore.isAuthenticated, // Assume we have refresh capability if authenticated
      willExpireSoon: false, // Handled by interceptors
      lastRefresh: Date.now(),
      refreshCount: 0,
      isUserActive: this.activityTracker.isUserActive,
      retryCount: 0,
      lastRetryTime: 0,
    };
  }

  /**
   * @deprecated This method is deprecated. Use getTokenInfo() instead.
   */
  static debugTokenState() {
    console.warn(
      "EnhancedTokenUtils.debugTokenState() is deprecated. Use simplified token management instead.",
    );
    const info = this.getTokenInfo();
    console.table(info);
    return info;
  }

  /**
   * @deprecated This method is deprecated. Smart refresh is now handled automatically by HTTP interceptors.
   */
  static async smartRefresh(): Promise<RefreshResult> {
    console.warn(
      "EnhancedTokenUtils.smartRefresh() is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );
    return this.attemptRefresh(true);
  }
}

// Initialize activity tracking when the module loads
if (typeof document !== "undefined") {
  EnhancedTokenUtils.initActivityTracking();
}

export default EnhancedTokenUtils;
