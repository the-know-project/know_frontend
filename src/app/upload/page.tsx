import { PageAuthGuard } from "@/src/features/auth/guards";
import UploadCanvas from "@/src/features/upload/components/upload-canvas";

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
