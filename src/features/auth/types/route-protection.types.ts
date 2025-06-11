export enum RouteProtectionLevel {
  PUBLIC = "public",
  AUTHENTICATED = "authenticated",
  GUEST_ONLY = "guest_only",
}

export enum UserRole {
  USER = "USER",
  ARTIST = "ARTIST",
  ADMIN = "ADMIN",
  BUYER = "BUYER",
  MODERATOR = "MODERATOR",
  NONE = "NONE",
}

interface RouteMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  showInNavigation?: boolean;
  navigationOrder?: number;
}

export interface RouteProtectionConfig {
  level: RouteProtectionLevel;
  requiredRoles?: string[];
  redirectTo?: string;
  fallbackComponent?: React.ComponentType;
}

export interface ProtectedRoute {
  path: string;
  protection: RouteProtectionConfig;
  name: string;
  description?: string;
  metadata?: RouteMetadata;
  children?: ProtectedRoute[];
}

export interface AuthRedirectConfig {
  authenticatedUserDefaultRoute: string;
  unauthenticatedUserDefaultRoute: string;
  loginRoute: string;
  homeRoute: string;
}

export interface RouteProtectionResult {
  isAllowed: boolean;
  shouldRedirect: boolean;
  redirectTo?: string;
  reason?: string;
}
