// app/orders/layout.tsx
import Sidebar from "../../features/profile/layout/buyer-sidebar";
import ExploreNav from "@/src/features/explore/components/explore-nav";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/*  Full-width header at the top */}
      <ExploreNav />

      {/*  Sidebar + main content beneath */}
      <div className="mt-16 flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
