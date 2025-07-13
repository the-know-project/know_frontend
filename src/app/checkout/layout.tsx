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
        <Sidebar />
        <div className=" max-w-3xl px-4 py-8">
          <CheckoutStepper />
          {children}
        </div>
      </div>
    </div>
  );
}
