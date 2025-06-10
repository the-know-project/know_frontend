"use client";

import UploadEditorCanvas from "./upload-editor-canvas";
import UploadForm from "./upload-form";
import { useRouter } from "next/navigation";
import { UploadProvider, useUploadContext } from "../context/upload-context";
import { useUploadAsset } from "../hooks/use-upload-asset";
import { IUploadAsset } from "../types/upload.types";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";

const UploadCanvasContent = () => {
  const router = useRouter();
  const { mutateAsync: hanndleUploadAsset, isPending } = useUploadAsset();
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

    if (!formData.file || !formData.title || !formData.size) {
      alert("Please fill in title and upload a file");
      return;
    }

    const uploadData: IUploadAsset = {
      fileName: formData.title,
      asset: formData.file,
      size: formData.size,
      tags: formData.tags,
      categories: formData.categories,
      customMetadata: formData.tags,
    };

    const data = await hanndleUploadAsset(uploadData);
    if (data.status === 200) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: " oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
      router.push("/explore");
    } else if (data.status === 500) {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={data.message} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    } else {
      toast("", {
        icon: <ToastIcon />,
        description: <ToastDescription description={`An error occurred`} />,
        style: {
          backdropFilter: "-moz-initial",
          opacity: "-moz-initial",
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          font: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "bolder",
        },
      });
    }
  };

  return (
    <section className="flex w-full flex-col md:flex-row md:justify-between">
      <div className="flex w-full flex-col md:w-9/12">
        <UploadForm
          onCancel={handleGoBack}
          onSaveDraft={handleOnSave}
          onContinue={handleOnContinue}
          isPending={isPending}
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
