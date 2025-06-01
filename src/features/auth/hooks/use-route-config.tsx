import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { routeConfigService } from "../service/route-config.service";
import { useAuthStatus } from "./use-auth-status";
import { ProtectedRoute } from "../types/route-protection.types";

interface UseRouteConfigReturn {
  currentRoute: ProtectedRoute | undefined;
  navigationRoutes: ProtectedRoute[];
  pageTitle: string;
  breadcrumb: Array<{ name: string; path: string }>;
  isPublicRoute: boolean;
  isAuthRoute: boolean;
  isProtectedRoute: boolean;
  isAdminRoute: boolean;
}

export const useRouteConfig = (): UseRouteConfigReturn => {
  const pathname = usePathname();
  const { role } = useAuthStatus();

  const routeData = useMemo(() => {
    const currentRoute = routeConfigService.getRouteConfig(pathname);
    const navigationRoutes = routeConfigService.getNavigationRoutes(role);
    const pageTitle = routeConfigService.getPageTitle(pathname);
    const breadcrumb = routeConfigService.getBreadcrumb(pathname);

    return {
      currentRoute,
      navigationRoutes,
      pageTitle,
      breadcrumb,
      isPublicRoute: routeConfigService.isPublicRoute(pathname),
      isAuthRoute: routeConfigService.isAuthRoute(pathname),
      isProtectedRoute: routeConfigService.isProtectedRoute(pathname),
      isAdminRoute: routeConfigService.isAdminRoute(pathname),
    };
  }, [pathname, role]);

  return routeData;
};
