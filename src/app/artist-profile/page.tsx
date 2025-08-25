import { ArtistGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import { ProfileGrid } from "@/src/features/profile/components/profile-grid";

export default function Page() {
  return (
    <ArtistGuard>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <main className="px-6">
            <ProfileGrid />
          </main>
        </div>
      </div>
    </ArtistGuard>
  );
}
