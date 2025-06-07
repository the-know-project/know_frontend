import UploadCanvas from "@/src/features/auth/components/upload-canvas";
import { PageAuthGuard } from "@/src/features/auth/guards";

const UploadPage = () => {
  return (
    <PageAuthGuard requiredRoles={["ARTIST"]} requiresAuth>
      <section className="relative z-50 flex w-full flex-col">
        <UploadCanvas />
      </section>
    </PageAuthGuard>
  );
};

export default UploadPage;
