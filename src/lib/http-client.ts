import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { isProduction } from "../config/environment";
import { env } from "../config/schemas/env";
import { useTokenStore } from "../features/auth/state/store";

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}

class HttpClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private requestQueue: QueuedRequest[] = [];

  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance() {
    const config = env.env;
    const baseURL = isProduction() ? config.PROD_URL : config.STAGING_URL;

    return axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Only access token store on client side
        if (typeof window !== "undefined") {
          const token = useTokenStore.getState().getAccessToken();
          const isAuthenticated = useTokenStore.getState().isAuthenticated;

          if (token && this.requiresAuth(config)) {
            config.headers.Authorization = `Bearer ${token}`;
          } else if (this.requiresAuth(config) && !token) {
            console.warn(
              `⚠️ HTTP Client: Request requires auth but no token available for ${config.url}`,
            );
          }
        }

        return config;
      },
      (error) => {
        console.error("❌ HTTP Client: Request interceptor error:", error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
          _networkRetryCount?: number;
        };

        if (
          this.isNetworkError(error) &&
          this.shouldRetryNetworkError(originalRequest)
        ) {
          return this.retryNetworkRequest(originalRequest);
        }

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.requiresAuth(originalRequest)
        ) {
          // Only proceed with refresh on client side
          if (typeof window === "undefined") {
            return Promise.reject(error);
          }

          const currentToken = useTokenStore.getState().getAccessToken();
          if (currentToken) {
          }

          originalRequest._retry = true;

          if (this.isRefreshing) {
            console.log(
              "🔄 HTTP Client: Token refresh already in progress, queuing request",
            );
            return new Promise((resolve, reject) => {
              this.requestQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          this.isRefreshing = true;

          try {
            console.log(
              "🔄 HTTP Client: Access token expired, attempting silent refresh...",
            );
            console.log(
              `🔄 HTTP Client: Current queue size: ${this.requestQueue.length}`,
            );

            const refreshResponse = await this.attemptSilentRefresh();

            if (refreshResponse.success && refreshResponse.accessToken) {
              console.log("✅ HTTP Client: Token refresh successful");

              const userToStore =
                refreshResponse.user ||
                (typeof window !== "undefined"
                  ? useTokenStore.getState().getUser()
                  : null);

              if (userToStore) {
                useTokenStore
                  .getState()
                  .setAccessToken(refreshResponse.accessToken, userToStore);
              } else {
                console.log(
                  "🔄 HTTP Client: Using refreshAccessToken to maintain existing user state",
                );
                if (typeof window !== "undefined") {
                  useTokenStore
                    .getState()
                    .refreshAccessToken(refreshResponse.accessToken);
                }
              }

              const verifyToken =
                typeof window !== "undefined"
                  ? useTokenStore.getState().getAccessToken()
                  : null;

              this.processQueue(null, refreshResponse.accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
                console.log(
                  "🔄 HTTP Client: Authorization header updated for retry",
                );
              } else {
                console.warn(
                  "⚠️ HTTP Client: No headers object found on originalRequest",
                );
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
              }

              console.log(
                `🔄 HTTP Client: Retrying original request to ${originalRequest.url} with new token`,
              );

              await new Promise((resolve) => setTimeout(resolve, 50));

              return this.axiosInstance(originalRequest);
            } else {
              console.warn("❌ HTTP Client: Token refresh failed");
              console.warn(
                "❌ HTTP Client: Refresh response:",
                refreshResponse,
              );

              this.processQueue(new Error("Token refresh failed"));

              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("❌ HTTP Client: Token refresh error:", refreshError);

            this.processQueue(refreshError);

            const isAuthError =
              (refreshError as any)?.response?.status === 401 ||
              (refreshError as any)?.response?.status === 403;

            if (isAuthError) {
              console.warn(
                "🚨 HTTP Client: Refresh token invalid, logging out",
              );
              this.handleAuthFailure();
            }

            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private isNetworkError(error: AxiosError): boolean {
    return (
      !error.response &&
      (error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.message.includes("Network Error") ||
        error.message.includes("timeout") ||
        error.message.includes("network error"))
    );
  }

  private shouldRetryNetworkError(
    config: InternalAxiosRequestConfig & { _networkRetryCount?: number },
  ): boolean {
    const maxRetries = 3;
    const retryCount = config._networkRetryCount || 0;
    return retryCount < maxRetries;
  }

  private async retryNetworkRequest(
    config: InternalAxiosRequestConfig & { _networkRetryCount?: number },
  ): Promise<any> {
    const retryCount = (config._networkRetryCount || 0) + 1;
    config._networkRetryCount = retryCount;

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount - 1) * 1000;

    console.log(
      `🔄 HTTP Client: Network error detected, retrying request (attempt ${retryCount}/3) after ${delay}ms delay...`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const response = await this.axiosInstance(config);
      console.log(
        `✅ HTTP Client: Network retry successful on attempt ${retryCount}`,
      );
      return response;
    } catch (retryError) {
      if (retryCount >= 3) {
        console.error(
          `❌ HTTP Client: Network retry failed after ${retryCount} attempts`,
        );
        return Promise.reject(retryError);
      }
      throw retryError;
    }
  }

  private requiresAuth(config: AxiosRequestConfig): boolean {
    const skipAuthPaths = [
      "/api/auth/login",
      "/api/auth/registerUser",
      "/api/auth/refreshToken",
      "/api/mail-list/addToMailList",
      "/api/categories/getCategories",
    ];

    const url = config.url || "";
    return !skipAuthPaths.some((path) => url.includes(path));
  }

  private async attemptSilentRefresh(): Promise<{
    success: boolean;
    accessToken?: string;
    user?: any;
    error?: string;
  }> {
    try {
      console.log("🔄 HTTP Client: Starting refresh token request...");

      const response = await axios.post(
        `${this.axiosInstance.defaults.baseURL}/api/auth/refreshToken`,
        {},
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      console.log("🔄 HTTP Client: Refresh response status:", response.status);
      console.log("🔄 HTTP Client: Refresh response data:", response.data);
      console.log("🔄 HTTP Client: Response headers:", response.headers);

      if (response.status >= 200 && response.status < 300) {
        let accessToken =
          response.data?.data?.accessToken ||
          response.data?.data?.access_token ||
          response.data?.data?.token ||
          response.data?.accessToken ||
          response.data?.access_token ||
          response.data?.token;

        let user =
          response.data?.data?.user ||
          response.data?.data?.userData ||
          response.data?.user ||
          response.data?.userData;

        if (
          !accessToken &&
          typeof response.data === "string" &&
          response.data.length > 100
        ) {
          console.log(
            "🔄 HTTP Client: Response data appears to be a token directly",
          );
          accessToken = response.data;
        }

        if (!accessToken) {
          const scanForJWT = (obj: any, path = ""): string | null => {
            if (
              typeof obj === "string" &&
              obj.length > 100 &&
              obj.includes(".")
            ) {
              const parts = obj.split(".");
              if (parts.length === 3) {
                console.log(
                  `🔄 HTTP Client: Found potential JWT at ${path || "root"}`,
                );
                return obj;
              }
            }
            if (typeof obj === "object" && obj !== null) {
              for (const [key, value] of Object.entries(obj)) {
                const result = scanForJWT(value, path ? `${path}.${key}` : key);
                if (result) return result;
              }
            }
            return null;
          };

          accessToken = scanForJWT(response.data) || undefined;
        }

        console.log("🔄 HTTP Client: Extracted access token:", !!accessToken);
        console.log("🔄 HTTP Client: Extracted user data:", !!user);

        if (accessToken) {
          return {
            success: true,
            accessToken: accessToken,
            user: user,
          };
        } else {
          console.warn("🔄 HTTP Client: No access token found in response");
          console.warn(
            "🔄 HTTP Client: Available response keys:",
            Object.keys(response.data || {}),
          );
          if (response.data?.data) {
            console.warn(
              "🔄 HTTP Client: Available nested data keys:",
              Object.keys(response.data.data || {}),
            );
          }
          console.warn(
            "🔄 HTTP Client: Response data type:",
            typeof response.data,
          );
          console.warn("🔄 HTTP Client: Full response data:", response.data);
          return {
            success: false,
            error: "No access token in refresh response",
          };
        }
      } else {
        console.warn(
          "🔄 HTTP Client: Non-success status code:",
          response.status,
        );
        return {
          success: false,
          error: `Refresh failed with status: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("🔄 Refresh request failed:", error);

      if (axios.isAxiosError(error)) {
        console.error("🔄 Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message,
          code: error.code,
        });
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Refresh request failed",
      };
    }
  }

  private processQueue(error: any, newToken?: string): void {
    console.log(
      `🔄 HTTP Client: Processing ${this.requestQueue.length} queued requests`,
    );

    this.requestQueue.forEach(({ resolve, reject, config }, index) => {
      if (error) {
        console.log(`❌ HTTP Client: Rejecting queued request ${index + 1}`);
        reject(error);
      } else {
        console.log(
          `🔄 HTTP Client: Processing queued request ${index + 1}: ${config.url}`,
        );
        if (newToken) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`;
            console.log(
              `✅ HTTP Client: Updated Authorization header for queued request ${index + 1}`,
            );
          } else {
            console.warn(
              `⚠️ HTTP Client: No headers on queued request ${index + 1}, creating new headers object`,
            );
            config.headers = { Authorization: `Bearer ${newToken}` };
          }
        }
        resolve(this.axiosInstance(config));
      }
    });

    this.requestQueue = [];
    console.log("✅ HTTP Client: Request queue cleared");
  }

  private handleAuthFailure(): void {
    console.warn(
      "🚨 HTTP Client: Authentication failure - clearing local auth state",
    );

    if (typeof window !== "undefined") {
      useTokenStore.getState().clearAuth();
    }

    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
  }

  // Public HTTP methods
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    const token = useTokenStore.getState().getAccessToken();
    const isAuth = useTokenStore.getState().isAuthenticated;
    return !!(token && isAuth);
  }

  public getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || "";
  }

  public async attemptPublicSilentRefresh(): Promise<{
    success: boolean;
    accessToken?: string;
    user?: any;
    role?: any;
    error?: string;
  }> {
    return this.attemptSilentRefresh();
  }

  public async logout(): Promise<void> {
    try {
      await this.axiosInstance.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      console.log("✅ HTTP Client: Server logout successful");
    } catch (error) {
      console.warn(
        "⚠️ HTTP Client: Server logout failed, clearing local state anyway:",
        error,
      );
    } finally {
      this.handleAuthFailure();
    }
  }
}

export const httpClient = new HttpClient();

export const axiosInstance = httpClient.getInstance();
