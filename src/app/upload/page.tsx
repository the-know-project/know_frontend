import { ArtistGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";
import UploadCanvas from "@/src/features/upload/components/upload-canvas";

const UploadPage = () => {
  return (
    <ArtistGuard>
      <section className="relative z-50 flex w-full flex-col">
        <UploadCanvas />
      </section>
    </ArtistGuard>
  );
};

export default UploadPage;
