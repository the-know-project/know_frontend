// app/orders/layout.tsx
import ExploreNav from "@/src/features/explore/components/explore-nav";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Full-width header at the top */}
      <ExploreNav />
      
      {/* Main content below header - no sidebar */}
      <main className="flex-1 mt-16 max-w-7xl mx-auto w-full px-6">
        {children}
      </main>
    </div>
  );
}
