"use client";

import UploadEditorCanvas from "./upload-editor-canvas";
import UploadForm from "./upload-form";
import { useRouter } from "next/navigation";
import { UploadProvider, useUploadContext } from "../context/upload-context";
import { useUploadAsset } from "../hooks/use-upload-asset";
import { IUploadAssetClient } from "../types/upload.types";
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

    const uploadData: IUploadAssetClient = {
      fileName: formData.title,
      description: formData.description,
      asset: formData.file,
      size: formData.size,
      categories: formData.categories || [],
      tags: formData.tags || [],
      customMetadata: formData.tags || [],
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
    <UploadCanvasLayout>
      <UploadForm
        onCancel={handleGoBack}
        onSaveDraft={handleOnSave}
        onContinue={handleOnContinue}
        isPending={isPending}
      />
      <UploadEditorCanvas />
    </UploadCanvasLayout>
  );
};

const UploadCanvasLayout = ({
  children,
}: {
  children: [React.ReactNode, React.ReactNode];
}) => {
  const { isEditorOpen } = useUploadContext();

  return (
    <section className="flex w-full flex-row justify-between">
      <div
        className={`flex flex-col transition-all duration-300 ${
          isEditorOpen ? "hidden md:flex md:w-7/12 lg:w-8/12" : "w-full"
        }`}
      >
        {children[0]}
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${
          isEditorOpen ? "w-full md:w-5/12 lg:w-4/12" : "w-0"
        }`}
      >
        {children[1]}
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
