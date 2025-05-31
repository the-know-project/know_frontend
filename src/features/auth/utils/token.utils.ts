import { tokenService } from "../service/token.service";
import { useTokenStore } from "../state/store";

export class TokenUtils {
  private static tokenStore = useTokenStore.getState();

  static IsAuthenticated() {
    const accessToken = this.tokenStore.getAccessToken();

    if (!accessToken) return false;

    const validation = tokenService.validateToken(accessToken);
    return validation.isValid;
  }

  static async getValidAccessToken() {
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

    try {
      const refreshResponse = await tokenService.refreshAccessToken(
        refreshToken,
      );

      if (refreshResponse.status === 200 && refreshResponse.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: updatedUser,
        } = refreshResponse.data;

        this.tokenStore.setTokens(newAccessToken, newRefreshToken, updatedUser);

        return newAccessToken;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      this.tokenStore.clearTokens();
    }

    return null;
  }

  static async refreshIfNeeded(thresholdMinutes: number = 5) {
    const accessToken = this.tokenStore.getAccessToken();
    const refreshToken = this.tokenStore.getRefreshToken();
    const user = this.tokenStore.user;

    if (!accessToken || !refreshToken || !user) {
      return false;
    }

    if (!tokenService.willExpireSoon(accessToken, thresholdMinutes)) {
      return true;
    }

    try {
      const refreshResponse = await tokenService.refreshWithRetry(
        refreshToken,
      );

      if (refreshResponse.status === 200 && refreshResponse.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: updatedUser,
        } = refreshResponse.data;
        this.tokenStore.setTokens(newAccessToken, newRefreshToken, updatedUser);
        return true;
      }
    } catch (error) {
      console.error("Proactive token refresh failed:", error);
      this.tokenStore.clearTokens();
    }

    return false;
  }



  static async logout(): Promise<void> {
    const refreshToken = this.tokenStore.getRefreshToken();

    if (refreshToken) {
      try {
        await tokenService.revokeRefreshToken(refreshToken);
      } catch (error) {
        console.error("Server logout failed:", error);
      }
    }

    this.tokenStore.clearTokens();
  }
}
