"use client";

import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { IRole } from "@/src/features/auth/types/auth.types";
import TextEffectWithExit from "@/src/shared/components/animate-text";
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
          const userId = urlParams.get("userId");
          const email = urlParams.get("email");
          const role = urlParams.get("role");
          const isFirstTime = urlParams.get("isFirstTime");
          const firstName = urlParams.get("firstName");
          const imageUrl = urlParams.get("imageUrl");

          if (accessToken && userId && email && firstName && imageUrl) {
            auth.login(
              accessToken,
              { id: userId, email, firstName, imageUrl },
              role ? (role as IRole) : "BUYER",
            );

            // Add a small delay to ensure login is processed
            setTimeout(() => {
              if (role === "ARTIST") {
                router.push("/explore");
              } else {
                if (isFirstTime === "true") {
                  router.push("/personalize");
                } else {
                  router.push("/explore");
                }
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
        <TextEffectWithExit
          text="Are you in the know"
          style="!font-bebas !text-3xl !text-gray-600 !capitalize"
        />
      </div>
    </div>
  );
}
