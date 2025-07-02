"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { NavbarButton } from "@/src/shared/ui/resizable-navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileUpload, IconX } from "@tabler/icons-react";
import React, { DragEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUploadContext } from "../context/upload-context";
import { UploadFormSchema } from "../schema/upload.schema";
import { IUploadFormState } from "../types/upload.types";
import Spinner from "@/src/shared/components/spinner";

interface UploadFormProps {
  onSaveDraft?: (data: IUploadFormState) => void;
  onContinue?: (data: IUploadFormState) => void;
  onCancel?: () => void;
  isPending?: boolean;
}

const UploadForm = ({
  onSaveDraft,
  onContinue,
  onCancel,
  isPending = false,
}: UploadFormProps) => {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadData, updateBasicInfo } = useUploadContext();

  const form = useForm<IUploadFormState>({
    resolver: zodResolver(UploadFormSchema),
    defaultValues: {
      title: uploadData.title,
      file: uploadData.file || undefined,
    },
  });

  const watchedFile = form.watch("file");
  const watchedTitle = form.watch("title");

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      form.setValue("file", file);
      form.trigger("file");
      updateBasicInfo({ file });
      console.log("File dropped:", file.name);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      form.setValue("file", selectedFile);
      form.trigger("file");
      updateBasicInfo({ file: selectedFile });
      console.log("File updated:", selectedFile.name);

      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    updateBasicInfo(formData);
    if (formData.file && onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  const onSubmit = (data: IUploadFormState) => {
    console.log("Form submitted with data:", data);
    updateBasicInfo(data);
    if (onContinue) {
      onContinue(data);
    }
  };

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex min-h-screen flex-col items-start px-6 py-10">
      {/* Top Action Buttons */}
      <div className="mb-6 flex w-full items-center justify-between">
        <button
          className="font-bebas text-whit relative inline-flex w-fit items-center gap-1 rounded-full bg-red-600 p-2 text-sm font-medium capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
          onClick={onCancel}
          type="button"
        >
          <IconX width={20} height={20} color="white" />
        </button>
        <div className="flex gap-4 px-[50px]">
          <button
            className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#F97316] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
            onClick={handleSaveDraft}
            type="button"
            disabled={!watchedFile}
          >
            Save as draft
          </button>

          {isPending ? (
            <Spinner borderColor="border-blue" />
          ) : (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
              onClick={() => {
                if (watchedFile && watchedTitle) {
                  const data: IUploadFormState = {
                    file: watchedFile,
                    title: watchedTitle,
                  };
                  onSubmit(data);
                }
              }}
              disabled={!watchedFile || !watchedTitle}
            >
              Continue
            </button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-3xl space-y-6"
        >
          {/* Title Input Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="title_text">
                  Let the world see your magic!
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-bricolage placeholder:font-bricolage bg-transparent text-[32px] text-[#666666] placeholder:text-lg placeholder:text-neutral-700 focus-visible:shadow-none focus-visible:ring-0 lg:text-[35px]"
                    placeholder="Title of your project"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateBasicInfo({ title: e.target.value });
                      console.log("Title updated:", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Field */}
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    {/* Upload Box */}
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      htmlFor="file-upload"
                      className={`font-bricolage flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed text-center transition-colors ${
                        dragging
                          ? "border-primary bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      {previewUrl && watchedFile ? (
                        <div className="relative h-full w-full overflow-hidden rounded-md">
                          {watchedFile.type.startsWith("image/") ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : watchedFile.type.startsWith("video/") ? (
                            <video
                              src={previewUrl}
                              className="h-full w-full object-cover"
                              controls
                            />
                          ) : null}
                          <div className="bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity hover:opacity-100">
                            <p className="font-bricolage text-sm text-white">
                              Click to change file
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <IconFileUpload className="mb-2 text-4xl text-gray-500" />
                          <p className="font-bricolage font-semibold text-gray-600">
                            Drag and drop an image, or{" "}
                            <span className="font-semibold text-blue-600 underline">
                              Browse
                            </span>
                          </p>
                          <p className="font-bricolage mt-2 text-sm text-gray-400">
                            Max 120mb each (25mb for videos)
                          </p>
                          <div className="font-bricolage mt-4 space-y-1 text-sm text-gray-500">
                            <p>- Only upload media you own the rights to</p>
                            <p>- Video (mp4)</p>
                            <p>- Upload high resolution images (png, jpg)</p>
                          </div>
                        </>
                      )}
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/png, image/jpeg, video/mp4"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Preview */}
          {watchedFile && (
            <div className="font-bricolage mt-6 text-center">
              <p className="text-sm text-gray-600">Selected file:</p>
              <p className="text-base font-medium">{watchedFile.name}</p>
              <p className="text-sm text-gray-400">
                {(watchedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
