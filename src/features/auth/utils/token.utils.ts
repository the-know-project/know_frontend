import { useTokenStore } from "../state/store";
import { httpClient } from "../../../lib/http-client";

export class TokenUtils {
  private static getTokenStore() {
    return useTokenStore.getState();
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    const tokenStore = this.getTokenStore();
    return tokenStore.isAuthenticated && !!tokenStore.accessToken;
  }

  /**
   * Get current access token
   * @returns string | null - current access token or null if not available
   */
  static getAccessToken(): string | null {
    return this.getTokenStore().getAccessToken();
  }

  /**
   * Get current user data
   * @returns IUser | null - current user or null if not authenticated
   */
  static getUser() {
    return this.getTokenStore().getUser();
  }

  /**
   * Clear authentication state
   * This method clears local auth state only
   * For complete logout including server-side cleanup, use httpClient.logout()
   */
  static clearAuthState(): void {
    this.getTokenStore().clearAuth();
  }

  /**
   * Update access token in store
   * This is typically called by HTTP interceptors after successful refresh
   * @param accessToken - new access token
   */
  static updateAccessToken(accessToken: string): void {
    this.getTokenStore().updateAccessToken(accessToken);
  }

  /**
   * Check if we have a valid access token
   * Note: This doesn't validate the token's expiration server-side
   * Token expiration is now handled by HTTP interceptors
   * @returns boolean
   */
  static hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  /**
   * Perform complete logout including server-side cleanup
   * This will clear HTTP-only refresh token cookies and local state
   * @returns Promise<void>
   */
  static async logout(): Promise<void> {
    try {
      await httpClient.logout();
    } catch (error) {
      console.warn("Logout error:", error);
      // Clear local state anyway
      this.clearAuthState();
    }
  }

  /**
   * @deprecated Use httpClient.isAuthenticated() instead
   * This method is kept for backward compatibility
   */
  static IsAuthenticated(): boolean {
    console.warn(
      "TokenUtils.IsAuthenticated() is deprecated. Use TokenUtils.isAuthenticated() or httpClient.isAuthenticated() instead.",
    );
    return this.isAuthenticated();
  }

  /**
   * @deprecated Token refresh is now handled automatically by HTTP interceptors
   * This method will be removed in a future version
   */
  static async getValidAccessToken(): Promise<string | null> {
    console.warn(
      "TokenUtils.getValidAccessToken() is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );
    return this.getAccessToken();
  }

  /**
   * @deprecated Refresh tokens are now managed server-side via HTTP-only cookies
   * This method will be removed in a future version
   */
  static async refreshToken(): Promise<boolean> {
    console.warn(
      "TokenUtils.refreshToken() is deprecated. Token refresh is now handled automatically by HTTP interceptors with server-side cookies.",
    );
    return false;
  }

  /**
   * @deprecated Manual token refresh is no longer supported
   * This method will be removed in a future version
   */
  static async silentRefresh(): Promise<string | null> {
    console.warn(
      "TokenUtils.silentRefresh() is deprecated. Silent refresh is now handled automatically by HTTP interceptors.",
    );
    return this.getAccessToken();
  }

  /**
   * @deprecated This method is deprecated. Token refresh is now handled automatically by HTTP interceptors
   * This method will be removed in a future version
   */
  static async refreshIfNeeded(thresholdMinutes: number = 5): Promise<boolean> {
    console.warn(
      "TokenUtils.refreshIfNeeded() is deprecated. Token refresh is now handled automatically by HTTP interceptors.",
    );

    // Return true if we have a token, indicating "refresh not needed"
    return this.hasValidToken();
  }
}

// Export as default for backward compatibility
export default TokenUtils;
