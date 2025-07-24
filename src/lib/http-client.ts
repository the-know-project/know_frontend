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
import { EnhancedTokenUtils } from "../features/auth/utils/enhanced-token.utils";

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
    });
  }

  private setupInterceptors(): void {
    // Request Interceptor - Injects Auth token to requests
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useTokenStore.getState().getAccessToken();

        if (token && this.requiresAuth(config)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response Interceptor = Handle token refreshon 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.requestQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshResult = await this.attemptRefresh();
            if (refreshResult.success) {
              this.processQueue(null);

              const token = useTokenStore.getState().getAccessToken();
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              return this.axiosInstance(originalRequest);
            } else {
              if (refreshResult.retryable) {
                console.warn(
                  "🔄 Token refresh failed but will retry in background",
                );
                // For retryable failures, just reject the original request
                // The enhanced token utils will retry automatically
                return Promise.reject(error);
              }

              this.processQueue(
                new Error(refreshResult.error || "Token refresh failed"),
              );

              // Only clear tokens if refresh token is actually invalid
              if (refreshResult.shouldLogout) {
                console.warn(
                  "🚨 HTTP Client: Authentication failed, logging out",
                );
                this.handleAuthFailure();
              }

              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError);

            const isAuthError =
              (refreshError as any)?.response?.status === 401 ||
              (refreshError as any)?.response?.status === 403;

            if (isAuthError) {
              console.warn("🚨 HTTP Client: Authentication error, logging out");
              this.handleAuthFailure();
            } else {
              console.warn(
                "🔄 HTTP Client: Network/server error, will retry automatically",
              );
            }
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
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

  private async attemptRefresh(): Promise<{
    success: boolean;
    error?: string;
    shouldLogout?: boolean;
    retryable?: boolean;
    errorType?: string;
  }> {
    try {
      console.log("🔄 HTTP Client: Attempting token refresh silently...");
      return await EnhancedTokenUtils.attemptRefresh(true);
    } catch (error) {
      console.warn("⚠️ HTTP Client: Token refresh encountered error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown refresh error",
        shouldLogout: false,
        retryable: true,
        errorType: "unknown",
      };
    }
  }

  private processQueue(error: any): void {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        resolve(this.axiosInstance(config));
      }
    });

    this.requestQueue = [];
  }

  private handleAuthFailure(): void {
    console.warn("🚨 HTTP Client: Critical authentication failure detected");

    // Use enhanced utils for proper cleanup
    // This will handle server logout and local cleanup
    EnhancedTokenUtils.logout()
      .then(() => {
        console.log("✅ HTTP Client: Auth cleanup completed");
      })
      .catch((error) => {
        console.error("❌ HTTP Client: Cleanup error:", error);
      });
  }

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
}

export const httpClient = new HttpClient();

export const axiosInstance = httpClient.getInstance();
