import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { createUrl } from "@/src/utils/url-factory";
import { AUTH_OP } from "../data/auth.path";
import axios, { AxiosResponse } from "axios";
import {
  IRefreshTokenRequest,
  RefreshTokenResponse,
} from "./interface/token.interface";
import { IUser } from "../state/interface/auth.interface";

export class TokenService {
  private static instance: TokenService;

  public static getInstance() {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public validateToken(token: string | null) {
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

  public willExpireSoon(token: string | null, thresholdMinutes: number = 5) {
    const validation = this.validateToken(token);
    if (!validation.isValid || !validation.payload) return true;

    const currentDate = Date.now() / 1000;
    const expirationTime = validation.payload.exp;
    const timeUntilExpiration = expirationTime - currentDate;
    const thresholdSeconds = thresholdMinutes * 60;

    return timeUntilExpiration <= thresholdSeconds;
  }

  public getDefaultExpiresIn(): number {
    return 3600;
  }

  public calculateExpiresIn(currentToken: string | null): number {
    if (!currentToken) {
      return this.getDefaultExpiresIn();
    }

    const validation = this.validateToken(currentToken);
    if (!validation.isValid || !validation.payload) {
      return this.getDefaultExpiresIn();
    }

    const currentTime = Date.now() / 1000;
    const originalExpiration = validation.payload.exp;
    const originalDuration =
      originalExpiration - (validation.payload.iat || currentTime);

    return originalDuration > 0
      ? Math.floor(originalDuration)
      : this.getDefaultExpiresIn();
  }

  public async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const url = this.buildLogoutUrl();
      await axios.post(url, { refreshToken });
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

  public async refreshAccessToken(
    refreshToken: string,
    userId: string,
    expiresIn: number = 3600,
  ) {
    try {
      const url = this.buildRefreshUrl();
      const requestData: IRefreshTokenRequest = {
        refreshToken,
        userId,
        expiresIn,
      };

      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        url,
        requestData,
      );

      return response.data;

      //eslint-disable-next-line
    } catch (error: any) {
      console.error(`Token refresh error`);
      throw new Error("Failed to refresh access token");
    }
  }

  public async refreshWithRetry(
    refreshToken: string,
    userId: string,
    expiresIn: number = 3600,
    maxRetries: number = 2,
  ): Promise<RefreshTokenResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.refreshAccessToken(
          refreshToken,
          userId,
          expiresIn,
        );
        return result;
      } catch (error) {
        lastError = error as Error;

        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status === 401 || status === 403) {
            throw error;
          }
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
          await this.delay(delay);
        }
      }
    }

    throw lastError!;
  }

  private buildRefreshUrl() {
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
