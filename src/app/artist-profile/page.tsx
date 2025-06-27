import { PageAuthGuard } from "@/src/features/auth/guards";
import ExploreNav from "@/src/features/explore/components/explore-nav";
import PostGrid from "@/src/shared/components/postgrid";

export default function Page() {
  return (
    <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth={true}>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <ExploreNav />
          <main className="p-6">
            <PostGrid />
          </main>
        </div>
      </div>
    </PageAuthGuard>
  );
}
