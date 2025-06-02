"use client";

import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { TitleText } from "@/src/shared/layout/header";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const auth = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const handleCallback = async () => {
      try {
        hasProcessed.current = true;

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get("success") === "true") {
          const accessToken = urlParams.get("accessToken");
          const refreshToken = urlParams.get("refreshToken");
          const userId = urlParams.get("userId");
          const email = urlParams.get("email");
          const role = urlParams.get("role");

          if (accessToken && refreshToken && userId && email) {
            auth.login(accessToken, refreshToken, { id: userId, email }, role);

            // Add a small delay to ensure login is processed
            setTimeout(() => {
              if (role === "ARTIST") {
                router.push("/explore");
              } else {
                router.push("/personalize");
              }
            }, 100);
            return;
          }
        }

        setTimeout(() => {
          router.push("/login");
        }, 100);
      } catch (error) {
        console.error("OAuth callback error:", error);
        auth.logout();
        setTimeout(() => {
          router.push("/login");
        }, 100);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <TitleText textStyles={`w-full`}>
          <p className="font-bebas text-3xl text-gray-600 capitalize">
            Are you in the know?
          </p>
        </TitleText>
        <p className="mt-4 text-gray-500">Processing your authentication...</p>
      </div>
    </div>
  );
}
