export enum RouteProtectionLevel {
  PUBLIC = "public",
  AUTHENTICATED = "authenticated",
  GUEST_ONLY = "guest_only",
}

export enum UserRole {
  USER = "user",
  ARTIST = "artist",
  ADMIN = "admin",
  BUYER = "buyer",
  MODERATOR = "moderator",
  NONE = "none",
}

export interface RouteProtectionConfig {
  level: RouteProtectionLevel;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  fallbackComponent?: React.ComponentType;
}

export interface ProtectedRoute {
  path: string;
  protection: RouteProtectionConfig;
  name: string;
  description?: string;
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
