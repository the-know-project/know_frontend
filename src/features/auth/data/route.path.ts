export const ROUTE_PATHS = {
  HOME: "/",
  ABOUT: "/about",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    ROLE: "/role",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forgot-password",
    LOGOUT: "/logout",
  },

  EXPLORE: "/explore",
  PERSONALIZE: "/personalize",
  PUBLISH: "/publish",
  UPLOAD: "/upload",
  ARTIST_PROFILE: "/artist-profile",
  BUYER_PROFILE: "/buyer-profile",

  USER: {
    PROFILE: "/profile",
    SETTINGS: "/settings",
    ORDERS: "/orders",
    WISHLIST: "/wishlist",
    FOLLOWERS: "/followers",
    FOLLOWING: "/following",
    COLLECTIONS: "/collections",
    NOTIFICATIONS: "/notifications",
    DASHBOARD: "/dashboard",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    CONTENT: "/admin/content",
    ANALYTICS: "/admin/analytics",
  },

  // Error routes
  ERROR: {
    NOT_FOUND: "/404",
    UNAUTHORIZED: "/401",
    SERVER_ERROR: "/500",
  },
};

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
