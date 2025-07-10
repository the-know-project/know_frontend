import { PageAuthGuard } from "@/src/features/auth/guards";
import { ProfileGrid } from "@/src/features/profile/components/profile-grid";

export default function Page() {
  return (
    <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth={true}>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <main className="p-6">
            <ProfileGrid />
          </main>
        </div>
      </div>
    </PageAuthGuard>
  );
}
