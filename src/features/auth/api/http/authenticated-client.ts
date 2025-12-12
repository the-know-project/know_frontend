import { ApiClient } from "@/src/lib/api-client";
import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";
import { createUrl } from "@/src/utils/url-factory";

export class AuthenticatedApiClient {
  private static getBaseUrl(): string {
    const config = env.env;
    return isProduction() ? config.PROD_URL : config.STAGING_URL;
  }

  static async get<T>(path: string): Promise<T> {
    const url = createUrl({
      baseUrl: this.getBaseUrl(),
      path,
    });
    return ApiClient.get<T>(url);
  }

  static async post<T>(path: string, data: any): Promise<T> {
    const url = createUrl({
      baseUrl: this.getBaseUrl(),
      path,
    });
    return ApiClient.post<T>(url, data);
  }

  static async put<T>(path: string, data: any): Promise<T> {
    const url = createUrl({
      baseUrl: this.getBaseUrl(),
      path,
    });
    return ApiClient.put<T>(url, data);
  }

  static async delete<T>(path: string, data: any): Promise<T> {
    const url = createUrl({
      baseUrl: this.getBaseUrl(),
      path,
    });
    return ApiClient.delete<T>(url, data);
  }

  static window(path: string) {
    const url = createUrl({
      baseUrl: this.getBaseUrl(),
      path,
    });
    window.location.href = url;
  }
}
