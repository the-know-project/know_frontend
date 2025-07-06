import { PageAuthGuard } from "@/src/features/auth/guards";
import PostGrid from "@/src/shared/components/postgrid";

export default function Page() {
  return (
    <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth={true}>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <main className="p-6">
            <PostGrid />
          </main>
        </div>
      </div>
    </PageAuthGuard>
  );
}
