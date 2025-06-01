import { routeProtectionService } from "../service/route-protection.service";
import { RouteProtectionResult } from "../types/route-protection.types";

export class RouteProtectionUtils {
  static requiresAuth(path: string): boolean {
    return routeProtectionService.requiresAuthentication(path);
  }

  static isGuestOnly(path: string): boolean {
    return routeProtectionService.isGuestOnly(path);
  }

  static checkAccess(
    path: string,
    isAuthenticated: boolean,
    userRole?: string,
  ): RouteProtectionResult {
    return routeProtectionService.checkRouteAccess(
      path,
      isAuthenticated,
      userRole,
    );
  }

  static getRedirectUrl(path: string, isAuthenticated: boolean): string {
    if (isAuthenticated) {
      return routeProtectionService.getAuthenticatedUserRedirect(path);
    }
    return routeProtectionService.getUnauthenticatedUserRedirect(path);
  }
}
