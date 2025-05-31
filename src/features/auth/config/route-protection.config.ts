import {
  AuthRedirectConfig,
  ProtectedRoute,
  RouteProtectionLevel,
  UserRole,
} from "../types/route-protection.types";

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  // Public routes (Accessible to eeveryone)
  {
    path: "/",
    name: "Home",
    description: "Landing Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: "/explore",
    },
  },

  // Guests only
  {
    path: "/login",
    name: "Login",
    description: "Login Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: "/explore",
    },
  },
  {
    path: "/signup",
    name: "Signup",
    description: "Signup Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: "/explore",
    },
  },

  // Authenticated Users only
  {
    path: "/explore",
    name: "Explore",
    description: "Main dashboard",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: "/login",
    },
  },
  {
    path: "/publish",
    name: "Publish",
    description: "Publish Page",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: "/login",
    },
  },
  {
    path: "/artist-profile",
    name: "Artist Profile",
    description: "Artist Profile Page",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.ARTIST],
      redirectTo: "/login",
    },
  },
  {
    path: "/artist-profile/:id",
    name: "Artist Profile",
    description: "Artist Profile Page",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.ARTIST],
      redirectTo: "/login",
    },
  },
  {
    path: "/buyer-profile",
    name: "Buyer Profile",
    description: "Buyer Profile Page",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.BUYER],
      redirectTo: "/login",
    },
  },
  {
    path: "/buyer-profile/:id",
    name: "Buyer Profile",
    description: "Buyer Profile Page",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.BUYER],
      redirectTo: "/login",
    },
  },

  // Admin routes (role-based protection)
  {
    path: "/admin",
    name: "Admin Dashboard",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.ADMIN],
      redirectTo: "/explore",
    },
  },
];

export const AUHT_REDIRECT_CONFIG: AuthRedirectConfig = {
  authenticatedUserDefaultRoute: "/explore",
  unauthenticatedUserDefaultRoute: "/",
  loginRoute: "/login",
  homeRoute: "/",
};
