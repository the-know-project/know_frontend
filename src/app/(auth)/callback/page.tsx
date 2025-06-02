"use client";

import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useRoleStore } from "@/src/features/auth/state/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const role = useRoleStore((state) => state.role);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current URL to check for OAuth data
        const currentUrl = window.location.href;

        // If the page was loaded with OAuth data (you might need to adjust this based on how your backend returns data)
        const urlParams = new URLSearchParams(window.location.search);

        // Check if we have success data in URL params or need to fetch it
        if (urlParams.get("success") === "true") {
          // Extract tokens from URL params (adjust based on your backend implementation)
          const accessToken = urlParams.get("accessToken");
          const refreshToken = urlParams.get("refreshToken");
          const userId = urlParams.get("userId");
          const email = urlParams.get("email");

          if (accessToken && refreshToken && userId && email) {
            auth.login(accessToken, refreshToken, { id: userId, email }, role);

            if (role === "ARTIST") {
              router.push("/explore");
            } else {
              router.push("/personalize");
            }
            return;
          }
        }

        // If no success params, redirect to login
        router.push("/login");
      } catch (error) {
        console.error("OAuth callback error:", error);
        auth.logout();
        router.push("/login");
      }
    };

    handleCallback();
  }, [router, auth]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Processing login...</h2>
        <p className="text-gray-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}
