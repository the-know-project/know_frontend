import { RouteProtectionResult } from "../types/route-protection.types";

export class RouteMiddlewareUtils {
  /**
   * Log route access attempts for debugging
   */
  static logRouteAccess(
    path: string,
    result: RouteProtectionResult,
    userRole?: string,
  ): void {
    const logData = {
      path,
      allowed: result.isAllowed,
      shouldRedirect: result.shouldRedirect,
      redirectTo: result.redirectTo,
      reason: result.reason,
      userRole,
      timestamp: new Date().toISOString(),
    };

    if (result.isAllowed) {
      console.log("✅ Route access granted:", logData);
    } else {
      console.warn("❌ Route access denied:", logData);
    }
  }

  /**
   * Create a redirect URL with return path
   */
  static createRedirectWithReturn(
    redirectTo: string,
    currentPath: string,
  ): string {
    const url = new URL(redirectTo, window.location.origin);
    if (currentPath !== "/" && currentPath !== redirectTo) {
      url.searchParams.set("redirect", currentPath);
    }
    return url.pathname + url.search;
  }

  /**
   * Get return URL from query parameters
   */
  static getReturnUrl(defaultUrl: string = "/"): string {
    if (typeof window === "undefined") return defaultUrl;

    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get("redirect");

    return redirectUrl && redirectUrl.startsWith("/")
      ? redirectUrl
      : defaultUrl;
  }
}
