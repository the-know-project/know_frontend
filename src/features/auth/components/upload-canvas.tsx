"use client";

import UploadForm from "../../upload/components/upload-form";
import { useRouter } from "next/navigation";

const UploadCanvas = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <section className="flex w-full flex-col">
      <UploadForm onCancel={handleGoBack} />
    </section>
  );
};

export default UploadCanvas;
