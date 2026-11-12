"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IUploadFormState, ISizePickerForm } from "../types/upload.types";

// Define the complete upload data structure
export interface ICompleteUploadForm {
  title: string;

  files: File[];

  description: string;

  size: ISizePickerForm;

  tags: string[];

  categories: string[];
}

export type TUploadInitialData = Partial<Omit<ICompleteUploadForm, "files">> & {
  files?: File[];
};

interface UploadContextType {
  uploadData: ICompleteUploadForm;
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  updateBasicInfo: (data: Partial<IUploadFormState>) => void;
  updateSizeInfo: (data: Partial<ISizePickerForm>) => void;
  updateTags: (tags: string[]) => void;
  updateDescription: (description: string) => void;
  updateCategories: (categories: string[]) => void;
  getAllFormData: () => ICompleteUploadForm;
  resetForm: () => void;
}

const defaultUploadData: ICompleteUploadForm = {
  title: "",
  files: [],
  description: "",
  size: {
    width: undefined,
    height: undefined,
    depth: undefined,
    length: undefined,
    weight: 0,
    diameter: undefined,
    aspectRatio: undefined,
    dimensionUnit: "cm",
    weightUnit: "kg",
  },
  tags: [],
  categories: [],
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{
  children: ReactNode;
  initialData?: TUploadInitialData;
  initialEditorOpen?: boolean;
}> = ({ children, initialData, initialEditorOpen = false }) => {
  const [uploadData, setUploadData] = useState<ICompleteUploadForm>(() => ({
    ...defaultUploadData,
    ...initialData,
    files: initialData?.files ?? [],
    size: { ...defaultUploadData.size, ...initialData?.size },
  }));
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(initialEditorOpen);

  const updateBasicInfo = (data: Partial<IUploadFormState>) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };
      return updated;
    });
  };

  const updateSizeInfo = (data: Partial<ISizePickerForm>) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        size: {
          ...prev.size,
          ...data,
        },
      };
      return updated;
    });
  };

  const updateDescription = (description: string) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        description,
      };
      return updated;
    });
  };

  const updateTags = (tags: string[]) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        tags,
      };
      return updated;
    });
  };

  const updateCategories = (categories: string[]) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        categories,
      };
      return updated;
    });
  };

  const getAllFormData = () => {
    return uploadData;
  };

  const resetForm = () => {
    setUploadData(defaultUploadData);
  };

  const value: UploadContextType = {
    uploadData,
    isEditorOpen,
    setIsEditorOpen,
    updateBasicInfo,
    updateDescription,
    updateSizeInfo,
    updateTags,
    updateCategories,
    getAllFormData,
    resetForm,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
};
