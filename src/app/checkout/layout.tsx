// app/checkout/layout.tsx
import { ReactNode } from "react";
import { CheckoutStepper } from "./components/CheckoutStepper";
import ExploreNav from "@/src/features/explore/components/explore-nav";
import Sidebar from "../../features/profile/layout/buyer-sidebar";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ExploreNav />

      <div className="mt-16 flex flex-1">
        {/* Hide sidebar on mobile, show on sm and up */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        <div className="flex-1 px-3 py-4 sm:max-w-3xl sm:px-4 sm:py-8">
          <CheckoutStepper />
          {children}
        </div>
      </div>
    </div>
  );
}
