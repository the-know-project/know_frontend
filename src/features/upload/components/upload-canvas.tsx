"use client";

import UploadEditorCanvas from "./upload-editor-canvas";
import UploadForm from "./upload-form";
import { useRouter } from "next/navigation";

const UploadCanvas = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <section className="flex w-full flex-col md:flex-row md:justify-between">
      <div className="flex w-full flex-col md:w-9/12">
        <UploadForm onCancel={handleGoBack} />
      </div>

      <div className="flex w-full flex-col md:w-3/12">
        <UploadEditorCanvas />
      </div>
    </section>
  );
};

export default UploadCanvas;
