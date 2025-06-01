"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { RouteMiddleware } from "./RouteMiddleware";
import { RouteProtectionResult } from "../types/route-protection.types";

//eslint-disable-next-line
interface RouteProviderContextValue {
  // Add any route-level context values here if needed
}

const RouteProviderContext = createContext<
  RouteProviderContextValue | undefined
>(undefined);

export const useRouteProvider = () => {
  const context = useContext(RouteProviderContext);
  if (context === undefined) {
    throw new Error("useRouteProvider must be used within a RouteProvider");
  }
  return context;
};

interface RouteProviderProps {
  children: ReactNode;
  customLoadingComponent?: React.ComponentType;
  customAccessDeniedComponent?: React.ComponentType<{
    result: RouteProtectionResult;
  }>;
  onAccessDenied?: (result: RouteProtectionResult) => void;
  onRedirect?: (from: string, to: string) => void;
  redirectDelay?: number;
  enableLogging?: boolean;
}

/**
 * RouteProvider Component
 *
 * Provides route protection context and middleware for the entire application.
 */
export const RouteProvider: React.FC<RouteProviderProps> = ({
  children,
  customLoadingComponent,
  customAccessDeniedComponent,
  onAccessDenied,
  onRedirect,
  redirectDelay = 300,
  enableLogging = false,
}) => {
  const handleAccessDenied = (result: RouteProtectionResult) => {
    if (enableLogging) {
      console.warn("Route access denied:", result);
    }
    if (onAccessDenied) {
      onAccessDenied(result);
    }
  };

  const handleRedirect = (from: string, to: string) => {
    if (enableLogging) {
      console.log("Route redirect:", { from, to });
    }
    if (onRedirect) {
      onRedirect(from, to);
    }
  };

  const contextValue: RouteProviderContextValue = {
    // Add context values here if needed
  };

  return (
    <RouteProviderContext.Provider value={contextValue}>
      <RouteMiddleware
        loadingComponent={customLoadingComponent}
        accessDeniedComponent={customAccessDeniedComponent}
        onAccessDenied={handleAccessDenied}
        onRedirect={handleRedirect}
        redirectDelay={redirectDelay}
      >
        {children}
      </RouteMiddleware>
    </RouteProviderContext.Provider>
  );
};
