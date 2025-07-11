import Sidebar from "../../features/profile/layout/buyer-sidebar";
import ExploreNav from "@/src/features/explore/components/explore-nav";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ExploreNav />
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
