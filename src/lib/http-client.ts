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

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.requiresAuth(originalRequest)
        ) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
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

            const refreshResponse = await this.attemptSilentRefresh();

            if (refreshResponse.success && refreshResponse.accessToken) {
              console.log("✅ HTTP Client: Token refresh successful");

              const currentUser = useTokenStore.getState().getUser();
              if (currentUser) {
                useTokenStore
                  .getState()
                  .setAccessToken(refreshResponse.accessToken, currentUser);
              }

              this.processQueue(null, refreshResponse.accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
              }

              return this.axiosInstance(originalRequest);
            } else {
              console.warn("❌ HTTP Client: Token refresh failed");

              this.processQueue(new Error("Token refresh failed"));

              this.handleAuthFailure();

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

  private requiresAuth(config: AxiosRequestConfig): boolean {
    const skipAuthPaths = [
      "/api/auth/login",
      "/api/auth/registerUser",
      "/api/auth/refresh-token",
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
      const response = await axios.post(
        `${this.axiosInstance.defaults.baseURL}/api/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          timeout: 10000,
        },
      );

      if (response.data?.accessToken) {
        return {
          success: true,
          accessToken: response.data.accessToken,
          user: response.data.user,
        };
      } else {
        return {
          success: false,
          error: "No access token in refresh response",
        };
      }
    } catch (error) {
      console.error("🔄 Refresh request failed:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Refresh request failed",
      };
    }
  }

  private processQueue(error: any, newToken?: string): void {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
        resolve(this.axiosInstance(config));
      }
    });

    this.requestQueue = [];
  }

  private handleAuthFailure(): void {
    console.warn(
      "🚨 HTTP Client: Authentication failure - clearing local auth state",
    );

    useTokenStore.getState().clearAuth();

    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
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

  // Utility method to check if user is authenticated
  public isAuthenticated(): boolean {
    const token = useTokenStore.getState().getAccessToken();
    const isAuth = useTokenStore.getState().isAuthenticated;
    return !!(token && isAuth);
  }

  // Method to manually logout (can be called from components)
  public async logout(): Promise<void> {
    try {
      console.log("🚪 HTTP Client: Initiating logout...");

      // Call server logout endpoint to clear refresh token cookie
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
      // Always clear local state
      this.handleAuthFailure();
    }
  }
}

export const httpClient = new HttpClient();

export const axiosInstance = httpClient.getInstance();
