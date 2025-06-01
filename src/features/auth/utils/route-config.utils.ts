import { ROUTE_PATHS } from "../data/route.path";
import { routeConfigService } from "../service/route-config.service";

export class RouteConfigUtils {
  static getAuthenticatedHomePage(): string {
    return ROUTE_PATHS.EXPLORE;
  }

  static getUnauthenticatedHomePage(): string {
    return ROUTE_PATHS.HOME;
  }

  static shouldShowNavigation(path: string): boolean {
    // Hide navigation on auth pages and error pages
    return (
      !routeConfigService.isAuthRoute(path) &&
      !path.startsWith("/error") &&
      !path.startsWith("/404") &&
      !path.startsWith("/500")
    );
  }

  static getDefaultRoute(isAuthenticated: boolean): string {
    return isAuthenticated
      ? RouteConfigUtils.getAuthenticatedHomePage()
      : RouteConfigUtils.getUnauthenticatedHomePage();
  }
}
