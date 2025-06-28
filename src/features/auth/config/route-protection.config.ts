import { ROUTE_PATHS } from "../data/route.path";
import {
  AuthRedirectConfig,
  ProtectedRoute,
  RouteProtectionLevel,
  UserRole,
} from "../types/route-protection.types";

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  // Public routes (Accessible to eeveryone)
  {
    path: ROUTE_PATHS.HOME,
    name: "Home",
    description: "Landing Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "KNOW - Ultimate Partners For Creatives",
      description: "Discover and showcase creative content",
      showInNavigation: false,
    },
  },

  {
    path: ROUTE_PATHS.ABOUT,
    name: "About",
    protection: {
      level: RouteProtectionLevel.PUBLIC,
    },
    metadata: {
      title: "About KNOW",
      description: "Learn more about our platform",
      showInNavigation: true,
      navigationOrder: 1,
    },
  },

  // Guests only
  {
    path: ROUTE_PATHS.AUTH.LOGIN,
    name: "Login",
    description: "Login Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Login - KNOW",
      showInNavigation: false,
    },
  },
  {
    path: ROUTE_PATHS.AUTH.REGISTER,
    name: "Signup",
    description: "Signup Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Signup - KNOW",
      showInNavigation: false,
    },
  },
  {
    path: ROUTE_PATHS.AUTH.ROLE,
    name: "Role",
    description: "Role Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Select a Role - KNOW",
      showInNavigation: false,
    },
  },
  {
    path: ROUTE_PATHS.AUTH.REGISTER,
    name: "Signup",
    description: "Signup Page",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Signup - KNOW",
      showInNavigation: false,
    },
  },
  {
    path: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
    name: "Forgot Password",
    protection: {
      level: RouteProtectionLevel.GUEST_ONLY,
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Forgot Password - KNOW",
      showInNavigation: false,
    },
  },

  // Authenticated Users only
  {
    path: ROUTE_PATHS.PERSONALIZE,
    name: "Personalize",
    description: "Personalize your profile",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.AUTH.LOGIN,
    },
    metadata: {
      title: "Personalize Your Experience - KNOW",
      showInNavigation: false,
    },
  },
  {
    path: ROUTE_PATHS.EXPLORE,
    name: "Explore",
    description: "Main dashboard",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.AUTH.LOGIN,
    },
    metadata: {
      title: "Explore - KNOW",
      description: "Discover Creative Content",
      showInNavigation: true,
      navigationOrder: 2,
    },
  },
  {
    path: ROUTE_PATHS.PUBLISH,
    name: "Publish",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.AUTH.LOGIN,
    },
    metadata: {
      title: "Publish - KNOW",
      description: "Share your creative work",
      showInNavigation: true,
      navigationOrder: 3,
    },
  },
  {
    path: ROUTE_PATHS.UPLOAD,
    name: "Upload",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.EXPLORE,
      requiredRoles: [UserRole.ARTIST],
    },
    metadata: {
      title: "Upload - KNOW",
      description: "Upload your content",
      showInNavigation: true,
      navigationOrder: 4,
    },
  },
  {
    path: ROUTE_PATHS.ARTIST_PROFILE,
    name: "Artist Profile",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.AUTH.LOGIN,
      requiredRoles: [UserRole.ARTIST],
    },
    metadata: {
      title: "Artist Profile - KNOW",
      showInNavigation: true,
      navigationOrder: 5,
    },
  },

  {
    path: ROUTE_PATHS.BUYER_PROFILE,
    name: "Buyer Profile",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      redirectTo: ROUTE_PATHS.AUTH.LOGIN,
      requiredRoles: [UserRole.BUYER],
    },
    metadata: {
      title: "Buyer Profile - KNOW",
      showInNavigation: false,
    },
  },

  {
    path: ROUTE_PATHS.ADMIN.DASHBOARD,
    name: "Admin Dashboard",
    protection: {
      level: RouteProtectionLevel.AUTHENTICATED,
      requiredRoles: [UserRole.ADMIN],
      redirectTo: ROUTE_PATHS.EXPLORE,
    },
    metadata: {
      title: "Admin Dashboard - KNOW",
      showInNavigation: false,
    },
    children: [
      {
        path: ROUTE_PATHS.ADMIN.USERS,
        name: "User Management",
        protection: {
          level: RouteProtectionLevel.AUTHENTICATED,
          requiredRoles: [UserRole.ADMIN],
          redirectTo: ROUTE_PATHS.EXPLORE,
        },
        metadata: {
          title: "User Management - KNOW",
          showInNavigation: false,
        },
      },
    ],
  },
];

export const AUTH_REDIRECT_CONFIG: AuthRedirectConfig = {
  authenticatedUserDefaultRoute: ROUTE_PATHS.EXPLORE,
  unauthenticatedUserDefaultRoute: ROUTE_PATHS.HOME,
  loginRoute: ROUTE_PATHS.AUTH.LOGIN,
  homeRoute: ROUTE_PATHS.HOME,
};

export const ROUTE_GROUPS = {
  PUBLIC: [ROUTE_PATHS.HOME, ROUTE_PATHS.ABOUT],
  AUTH: Object.values(ROUTE_PATHS.AUTH),
  PROTECTED: [
    ROUTE_PATHS.EXPLORE,
    ROUTE_PATHS.PUBLISH,
    ROUTE_PATHS.UPLOAD,
    ROUTE_PATHS.ARTIST_PROFILE,
    ROUTE_PATHS.BUYER_PROFILE,
    ROUTE_PATHS.USER,
    ...Object.values(ROUTE_PATHS.USER),
  ],
  ADMIN: Object.values(ROUTE_PATHS.ADMIN),
} as const;
