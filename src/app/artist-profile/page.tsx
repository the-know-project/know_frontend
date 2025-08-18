import { PageAuthGuard } from "@/src/features/auth/guards";
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import { ProfileGrid } from "@/src/features/profile/components/profile-grid";

export default function Page() {
  return (
    <EnhancedAuthProvider
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth={true}>
        <div className="flex min-h-screen">
          <div className="flex flex-1 flex-col">
            <main className="px-6">
              <ProfileGrid />
            </main>
          </div>
        </div>
      </PageAuthGuard>
    </EnhancedAuthProvider>
  );
}
