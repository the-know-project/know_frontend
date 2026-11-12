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
import type { TUserAssetData } from "@/src/features/profile/artist/dto/artist.dto";
import { useUpdateAsset } from "@/src/features/profile/artist/hooks/use-update-asset";

interface UploadCanvasProps {
  mode?: "create" | "edit";
  asset?: TUserAssetData;
  onCancel?: () => void;
  onComplete?: () => void;
}

const UploadCanvasContent = ({
  mode = "create",
  asset,
  onCancel,
  onComplete,
}: UploadCanvasProps) => {
  const router = useRouter();
  const { mutateAsync: uploadAsset, isPending: isUploading } = useUploadAsset();
  const { mutateAsync: saveAsset, isPending: isUpdating } = useUpdateAsset();
  const { getAllFormData } = useUploadContext();
  const isEditing = mode === "edit" && !!asset;
  const isPending = isUploading || isUpdating;

  const handleGoBack = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  const handleOnSave = () => {
    const formData = getAllFormData();
    console.log("Saving draft:", formData);
    // Implement save logic here
  };

  const handleOnContinue = async () => {
    const formData = getAllFormData();

    if (!formData.title || (!isEditing && formData.files.length === 0)) {
      alert("Please fill in title and upload a file");
      return;
    }

    const saveToastId = toast.loading(
      `${isEditing ? "Updating" : "Uploading"} Asset: ${formData.title}`,
      {
        style: {
          backgroundColor: "oklch(62.7% 0.194 149.214)",
          fontSize: "12px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      },
    );

    const uploadData: IUploadAssetClient = {
      fileName: formData.title,
      description: formData.description,
      asset: formData.files,
      size: formData.size,
      categories: formData.categories || [],
      tags: formData.tags || [],
      customMetadata: formData.tags || [],
    };

    try {
      const data =
        isEditing && asset
          ? await saveAsset({
              fileId: asset.fileId,
              fileName: formData.title,
              description: formData.description,
              size: formData.size,
              categories: formData.categories || [],
              tags: formData.tags || [],
            })
          : await uploadAsset(uploadData);
      if (data.status === 200) {
        toast.success(isEditing ? "Asset updated" : "Asset uploaded", {
          id: saveToastId,
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
        if (isEditing) onComplete?.();
        else router.push("/explore");
      } else {
        toast("An error occurred", {
          id: saveToastId,
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
      }
    } catch (error) {
      toast("An error occurred", {
        id: saveToastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription
            description={
              error instanceof Error
                ? error.message
                : "Upload failed. Please try again."
            }
          />
        ),
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
        existingMedia={
          isEditing && asset ? [asset.url, ...(asset.extraUrls || [])] : []
        }
        allowMediaChanges={!isEditing}
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

const UploadCanvas = ({
  mode = "create",
  asset,
  onCancel,
  onComplete,
}: UploadCanvasProps) => {
  const initialData = asset
    ? {
        title: asset.name,
        description: asset.description || "",
        size: asset.size,
        categories: asset.categories,
        tags: asset.tags,
      }
    : undefined;

  return (
    <UploadProvider
      initialData={initialData}
      initialEditorOpen={mode === "edit"}
    >
      <UploadCanvasContent
        mode={mode}
        asset={asset}
        onCancel={onCancel}
        onComplete={onComplete}
      />
    </UploadProvider>
  );
};

export default UploadCanvas;
