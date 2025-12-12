import { httpClient } from "./http-client";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * API Client - Simplified interface for making HTTP requests
 * Automatically handles authentication and provides consistent error handling
 */
export class ApiClient {
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

  private static handleError(error: any): Error {
    return error;
  }
}

export { httpClient };
