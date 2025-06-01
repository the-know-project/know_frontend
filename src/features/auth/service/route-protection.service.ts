import {
  AUTH_REDIRECT_CONFIG,
  PROTECTED_ROUTES,
} from "../config/route-protection.config";
import {
  ProtectedRoute,
  RouteProtectionLevel,
  RouteProtectionResult,
  UserRole,
} from "../types/route-protection.types";

export class RouteProtectionService {
  private static instance: RouteProtectionService;

  public static getInstance(): RouteProtectionService {
    if (!RouteProtectionService.instance) {
      RouteProtectionService.instance = new RouteProtectionService();
    }
    return RouteProtectionService.instance;
  }

  public requiresAuthentication(path: string): boolean {
    const route = this.findRouteConfig(path);
    return route?.protection.level === RouteProtectionLevel.AUTHENTICATED;
  }

  public isGuestOnly(path: string): boolean {
    const route = this.findRouteConfig(path);
    return route?.protection.level === RouteProtectionLevel.GUEST_ONLY;
  }

  public isPublic(path: string): boolean {
    const route = this.findRouteConfig(path);
    return route?.protection.level === RouteProtectionLevel.PUBLIC;
  }

  public checkRouteAccess(
    path: string,
    isAuthenticated: boolean,
    userRole?: string,
  ): RouteProtectionResult {
    const route = this.findRouteConfig(path);

    if (!route) {
      return {
        isAllowed: true,
        shouldRedirect: false,
      };
    }

    const { protection } = route;

    if (protection.level === RouteProtectionLevel.PUBLIC) {
      return {
        isAllowed: true,
        shouldRedirect: false,
      };
    }

    if (protection.level === RouteProtectionLevel.GUEST_ONLY) {
      if (isAuthenticated) {
        return {
          isAllowed: false,
          shouldRedirect: true,
          redirectTo:
            protection.redirectTo ||
            AUTH_REDIRECT_CONFIG.authenticatedUserDefaultRoute,
          reason: "Route is for unauthenticated users only",
        };
      }

      return {
        isAllowed: true,
        shouldRedirect: false,
      };
    }

    if (protection.level === RouteProtectionLevel.AUTHENTICATED) {
      if (!isAuthenticated) {
        return {
          isAllowed: false,
          shouldRedirect: true,
          redirectTo: protection.redirectTo || AUTH_REDIRECT_CONFIG.loginRoute,
          reason: "Authentication required",
        };
      }
    }

    if (protection.requiredRoles && protection.requiredRoles.length > 0) {
      if (
        !userRole ||
        !protection.requiredRoles.includes(userRole as UserRole)
      ) {
        return {
          isAllowed: false,
          shouldRedirect: true,
          redirectTo:
            protection.redirectTo ||
            AUTH_REDIRECT_CONFIG.authenticatedUserDefaultRoute,
          reason: "Insufficient permissions",
        };
      }
      return {
        isAllowed: true,
        shouldRedirect: false,
      };
    }

    return {
      isAllowed: true,
      shouldRedirect: false,
    };
  }

  public getAuthenticatedUserRedirect(currentPath: string) {
    const route = this.findRouteConfig(currentPath);
    if (route?.protection.redirectTo) {
      return route.protection.redirectTo;
    }

    return AUTH_REDIRECT_CONFIG.authenticatedUserDefaultRoute;
  }

  public getUnauthenticatedUserRedirect(currentPath: string) {
    const route = this.findRouteConfig(currentPath);
    if (route?.protection.redirectTo) {
      return route.protection.redirectTo;
    }

    return AUTH_REDIRECT_CONFIG.loginRoute;
  }

  private findRouteConfig(path: string): ProtectedRoute | undefined {
    return PROTECTED_ROUTES.find((route) => {
      if (route.path === path) return true;

      if (route.path.includes("[") && route.path.includes("]")) {
        const routePattern = route.path.replace(/\[.*?\]/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      }

      return false;
    });
  }
}

export const routeProtectionService = RouteProtectionService.getInstance();
