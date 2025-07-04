"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IUploadFormState, ISizePickerForm } from "../types/upload.types";

// Define the complete upload data structure
export interface ICompleteUploadForm {
  title: string;

  file: File | null;

  description: string;

  size: ISizePickerForm;

  tags: string[];

  categories: string[];
}

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
  file: null,
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

export const UploadProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadData, setUploadData] =
    useState<ICompleteUploadForm>(defaultUploadData);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);

  const updateBasicInfo = (data: Partial<IUploadFormState>) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };
      console.log("Context: New upload data after basic info update:", updated);
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
      console.log("Context: New upload data after size update:", updated);
      return updated;
    });
  };

  const updateDescription = (description: string) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        description,
      };
      console.log(
        "Context: New upload data after description update:",
        updated,
      );
      return updated;
    });
  };

  const updateTags = (tags: string[]) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        tags,
      };
      console.log("Context: New upload data after tags update:", updated);
      return updated;
    });
  };

  const updateCategories = (categories: string[]) => {
    setUploadData((prev) => {
      const updated = {
        ...prev,
        categories,
      };
      console.log("Context: New upload data after categories update:", updated);
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
