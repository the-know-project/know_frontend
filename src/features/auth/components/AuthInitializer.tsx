"use client";

import { useEffect } from "react";
import { useTokenStore } from "@/src/features/auth/store/useTokenStore";
import { ApiClient } from "@/src/lib/api-client";

export function AuthInitializer() {
  const { accessToken, hasHydrated } = useTokenStore();

  useEffect(() => {
    if (hasHydrated && accessToken) {
      ApiClient.setAuthToken(accessToken);
    }
  }, [hasHydrated, accessToken]);

  return null;
}
