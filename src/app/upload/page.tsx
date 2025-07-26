import { PageAuthGuard } from "@/src/features/auth/guards";
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";
import UploadCanvas from "@/src/features/upload/components/upload-canvas";

const UploadPage = () => {
  return (
    <EnhancedAuthProvider
      enableAutoRefresh={true}
      refreshThresholdMinutes={20}
      checkInterval={1600000}
      publicRoutes={["/login", "/register", "/", "/role", "/about", "/contact"]}
    >
      <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth>
        <section className="relative z-50 flex w-full flex-col">
          <UploadCanvas />
        </section>
      </PageAuthGuard>
    </EnhancedAuthProvider>
  );
};

export default UploadPage;
