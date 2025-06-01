import {
  ProtectedRoute,
  RouteProtectionLevel,
  UserRole,
} from "../types/route-protection.types";
import {
  PROTECTED_ROUTES,
  ROUTE_GROUPS,
} from "../config/route-protection.config";

export class RouteConfigService {
  private static instance: RouteConfigService;
  private routeCache = new Map<string, ProtectedRoute>();

  public static getInstance(): RouteConfigService {
    if (!RouteConfigService.instance) {
      RouteConfigService.instance = new RouteConfigService();
    }
    return RouteConfigService.instance;
  }

  constructor() {
    this.buildRouteCache();
  }

  public getAllRoutes(): ProtectedRoute[] {
    return PROTECTED_ROUTES;
  }

  public getRoutesByProtectionLevel(
    level: RouteProtectionLevel,
  ): ProtectedRoute[] {
    return PROTECTED_ROUTES.filter((route) => route.protection.level === level);
  }

  public getRoutesForRole(userRole?: string): ProtectedRoute[] {
    if (!userRole) {
      return this.getRoutesByProtectionLevel(
        RouteProtectionLevel.PUBLIC,
      ).concat(
        this.getRoutesByProtectionLevel(RouteProtectionLevel.GUEST_ONLY),
      );
    }

    return PROTECTED_ROUTES.filter((route) => {
      if (route.protection.level === RouteProtectionLevel.PUBLIC) {
        return true;
      }

      if (route.protection.level === RouteProtectionLevel.AUTHENTICATED) {
        if (!route.protection.requiredRoles) {
          return true;
        }
        return route.protection.requiredRoles.includes(userRole as UserRole);
      }

      return false;
    });
  }

  public getNavigationRoutes(userRole?: string): ProtectedRoute[] {
    const accessibleRoutes = this.getRoutesForRole(userRole);
    return accessibleRoutes
      .filter((route) => route.metadata?.showInNavigation === true)
      .sort((a, b) => {
        const orderA = a.metadata?.navigationOrder ?? 999;
        const orderB = b.metadata?.navigationOrder ?? 999;
        return orderA - orderB;
      });
  }

  public routeExists(path: string): boolean {
    return this.routeCache.has(path);
  }

  public getRouteConfig(path: string): ProtectedRoute | undefined {
    // Try exact match first
    let route = this.routeCache.get(path);

    if (!route) {
      // Try dynamic route matching
      route = this.findDynamicRoute(path);
    }

    return route;
  }

  public isPublicRoute(path: string): boolean {
    return ROUTE_GROUPS.PUBLIC.includes(path as any);
  }

  public isAuthRoute(path: string): boolean {
    return ROUTE_GROUPS.AUTH.includes(path as any);
  }

  public isProtectedRoute(path: string): boolean {
    return ROUTE_GROUPS.PROTECTED.includes(path as any);
  }

  public isAdminRoute(path: string): boolean {
    return ROUTE_GROUPS.ADMIN.includes(path as any);
  }

  public getRouteMetadata(path: string): any {
    const route = this.getRouteConfig(path);
    return route?.metadata;
  }

  public getPageTitle(path: string): string {
    const metadata = this.getRouteMetadata(path);
    return metadata?.title || "KNOW";
  }

  public getBreadcrumb(path: string): Array<{ name: string; path: string }> {
    const segments = path.split("/").filter(Boolean);
    const breadcrumb: Array<{ name: string; path: string }> = [];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const route = this.getRouteConfig(currentPath);
      if (route) {
        breadcrumb.push({
          name: route.name,
          path: currentPath,
        });
      }
    }

    return breadcrumb;
  }

  /**
   * Validate route configuration
   */
  public validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate paths
    const paths = new Set<string>();
    for (const route of PROTECTED_ROUTES) {
      if (paths.has(route.path)) {
        errors.push(`Duplicate route path: ${route.path}`);
      }
      paths.add(route.path);
    }

    // Check for circular redirects
    for (const route of PROTECTED_ROUTES) {
      if (route.protection.redirectTo === route.path) {
        errors.push(`Circular redirect in route: ${route.path}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Build route cache for faster lookups
   */
  private buildRouteCache(): void {
    this.routeCache.clear();

    const addToCache = (routes: ProtectedRoute[]) => {
      for (const route of routes) {
        this.routeCache.set(route.path, route);
        if ("children" in route && route.children) {
          addToCache(route.children);
        }
      }
    };

    addToCache(PROTECTED_ROUTES);
  }

  /**
   * Find dynamic route (for routes with parameters)
   */
  private findDynamicRoute(path: string): ProtectedRoute | undefined {
    for (const route of PROTECTED_ROUTES) {
      if (this.matchDynamicRoute(route.path, path)) {
        return route;
      }
    }
    return undefined;
  }

  private matchDynamicRoute(routePattern: string, actualPath: string): boolean {
    if (!routePattern.includes("[") || !routePattern.includes("]")) {
      return false;
    }

    const pattern = routePattern
      .replace(/\[.*?\]/g, "[^/]+")
      .replace(/\//g, "\\/");

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(actualPath);
  }
}

export const routeConfigService = RouteConfigService.getInstance();
