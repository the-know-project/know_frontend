import { httpClient } from "./http-client";
import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * API Client - Simplified interface for making HTTP requests
 * Automatically handles authentication and provides consistent error handling
 */
export class ApiClient {
  static getBaseUrl(): string {
    const baseUrl = isProduction() ? env.env.PROD_URL : env.env.STAGING_URL;
    return baseUrl.replace(/\/$/, "");
  }
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await httpClient.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await httpClient.post(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await httpClient.put(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await httpClient.patch(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async delete<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await httpClient.delete(url, {
        ...config,
        data,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static window(path: string) {
    window.location.href = `${this.getBaseUrl()}${path}`;
  }
  private static handleError(error: any): Error {
    return error;
  }
}

export { httpClient };
