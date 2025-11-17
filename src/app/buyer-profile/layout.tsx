import Sidebar from "@/src/features/profile/layout/buyer-sidebar";
import ExploreNav from "@/src/features/explore/components/explore-nav";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ExploreNav />

      <div className="mt-16 flex flex-1">
        {/* Hide sidebar on mobile (below 640px), show on sm and up */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
