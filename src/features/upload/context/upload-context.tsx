"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IUploadFormState, ISizePickerForm } from "../types/upload.types";

// Define the complete upload data structure
export interface ICompleteUploadForm {
  // Basic upload data
  title: string;
  file: File | null;

  // Size data
  size: ISizePickerForm;

  // Tags data
  tags: string[];

  // Category data
  category: string;
}

interface UploadContextType {
  uploadData: ICompleteUploadForm;
  updateBasicInfo: (data: Partial<IUploadFormState>) => void;
  updateSizeInfo: (data: Partial<ISizePickerForm>) => void;
  updateTags: (tags: string[]) => void;
  updateCategory: (category: string) => void;
  getAllFormData: () => ICompleteUploadForm;
  resetForm: () => void;
}

const defaultUploadData: ICompleteUploadForm = {
  title: "",
  file: null,
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
  category: "",
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadData, setUploadData] =
    useState<ICompleteUploadForm>(defaultUploadData);

  const updateBasicInfo = (data: Partial<IUploadFormState>) => {
    setUploadData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const updateSizeInfo = (data: Partial<ISizePickerForm>) => {
    setUploadData((prev) => ({
      ...prev,
      size: {
        ...prev.size,
        ...data,
      },
    }));
  };

  const updateTags = (tags: string[]) => {
    setUploadData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const updateCategory = (category: string) => {
    setUploadData((prev) => ({
      ...prev,
      category,
    }));
  };

  const getAllFormData = () => uploadData;

  const resetForm = () => {
    setUploadData(defaultUploadData);
  };

  const value: UploadContextType = {
    uploadData,
    updateBasicInfo,
    updateSizeInfo,
    updateTags,
    updateCategory,
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
