"use client";

import UploadEditorCanvas from "./upload-editor-canvas";
import UploadForm from "./upload-form";
import { useRouter } from "next/navigation";
import { UploadProvider, useUploadContext } from "../context/upload-context";

const UploadCanvasContent = () => {
  const router = useRouter();
  const { getAllFormData } = useUploadContext();

  const handleGoBack = () => {
    router.back();
  };

  const handleOnSave = () => {
    const formData = getAllFormData();
    console.log("Saving draft:", formData);
    // Implement save logic here
  };

  const handleOnContinue = async () => {
    const formData = getAllFormData();

    // Validate that required fields are filled
    if (!formData.file || !formData.title) {
      alert("Please fill in title and upload a file");
      return;
    }

    console.log("Complete form data:", formData);

    // Create FormData for API submission
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("file", formData.file);
    submissionData.append("tags", JSON.stringify(formData.tags));
    submissionData.append("category", formData.category);
    submissionData.append("size", JSON.stringify(formData.size));

    // Mutation goes here
  };

  return (
    <section className="flex w-full flex-col md:flex-row md:justify-between">
      <div className="flex w-full flex-col md:w-9/12">
        <UploadForm
          onCancel={handleGoBack}
          onSaveDraft={handleOnSave}
          onContinue={handleOnContinue}
        />
      </div>

      <div className="flex w-full flex-col md:w-3/12">
        <UploadEditorCanvas />
      </div>
    </section>
  );
};

const UploadCanvas = () => {
  return (
    <UploadProvider>
      <UploadCanvasContent />
    </UploadProvider>
  );
};

export default UploadCanvas;
