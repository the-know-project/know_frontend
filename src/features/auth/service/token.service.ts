import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { ApiClient } from "@/src/lib/api-client";
import { createUrl } from "@/src/utils/url-factory";
import { AUTH_OP } from "../data/auth.path";
import { IUser } from "../state/interface/auth.interface";
import {
  IRefreshTokenRequest,
  RefreshTokenResponse,
  TokenValidationResult,
} from "./interface/token.interface";

export class TokenService {
  private static instance: TokenService;

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Validates a JWT token and returns validation result
   */
  public validateToken(token: string | null): TokenValidationResult {
    if (!token) {
      return { isValid: false, isExpired: true };
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { isValid: false, isExpired: true };
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;

      return {
        isValid: !isExpired,
        isExpired,
        payload,
      };
    } catch (error) {
      console.error("Token validation error:", error);
      return { isValid: false, isExpired: true };
    }
  }

  public willExpireSoon(
    token: string | null,
    thresholdMinutes: number = 5,
  ): boolean {
    const validation = this.validateToken(token);
    if (!validation.isValid || !validation.payload) return true;

    const currentTime = Date.now() / 1000;
    const expirationTime = validation.payload.exp;
    const timeUntilExpiration = expirationTime - currentTime;
    const thresholdSeconds = thresholdMinutes * 60;

    return timeUntilExpiration <= thresholdSeconds;
  }

  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    try {
      const url = this.buildRefreshUrl();

      const requestData: IRefreshTokenRequest = { refreshToken };
      return await ApiClient.post<RefreshTokenResponse>(url, requestData);
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  public async refreshWithRetry(
    refreshToken: string,
    maxRetries: number = 2,
  ): Promise<RefreshTokenResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.refreshAccessToken(refreshToken);
        return result;
      } catch (error: any) {
        lastError = error;

        // Don't retry on authentication errors (401, 403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await this.delay(delay);
        }
      }
    }

    throw lastError!;
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const url = this.buildLogoutUrl();
      await ApiClient.post(url, { refreshToken });
    } catch (error) {
      console.error("Token revocation error:", error);
    }
  }

  public extractUserFromToken(token: string): IUser | null {
    const validation = this.validateToken(token);
    if (!validation.isValid || !validation.payload) return null;

    try {
      return {
        id: validation.payload.sub || validation.payload.userId,
        email: validation.payload.email,
      };
    } catch (error) {
      console.error("User extraction error:", error);
      return null;
    }
  }

  private buildRefreshUrl(): string {
    const config = env.env;
    const baseUrl = isProduction() ? config.PROD_URL : config.STAGING_URL;
    return createUrl({
      baseUrl,
      path: AUTH_OP.REFRESH_TOKEN,
    });
  }

  private buildLogoutUrl(): string {
    const config = env.env;
    const baseUrl = isProduction() ? config.PROD_URL : config.STAGING_URL;
    return createUrl({
      baseUrl,
      path: AUTH_OP.LOGOUT,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const tokenService = TokenService.getInstance();
