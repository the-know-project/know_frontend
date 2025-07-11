'use client';

import { PageAuthGuard } from "@/src/features/auth/guards";
import { useState } from "react";
import Sidebar from "../../features/profile/layout/buyer-sidebar";
import PostGrid from "@/src/shared/components/postgrid";
// import Cart from "@/src/features/profile/components/orders/Cart";
import AnalyticsPage from "./components/analytics";
// import CompletedOrders from "@/src/features/profile/components/orders/CompletedOrders";

const tabs = ["Posts", "Analytics", "Drafts"];

const tabComponents: Record<string, React.ComponentType> = {
  "Posts": PostGrid,
  "Analytics": AnalyticsPage,
  // Drafts: CompletedOrders,
};

const ArtistProfile = () => {
  const [activeTab, setActiveTab] = useState("PostGrid");

  const ActiveComponent = tabComponents[activeTab];

  return (
    <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth={true}>
      <div className="flex min-h-screen bg-gray-50">


        <main className="flex-1 p-6">
          
          <div className="mb-6 flex justify-around border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {ActiveComponent ? <ActiveComponent /> : <p>Tab not found</p>}
          </div>
        </main>
      </div>
    </PageAuthGuard>
  );
};

export default ArtistProfile;
