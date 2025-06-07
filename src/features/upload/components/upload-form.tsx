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
import Link from "next/link";
import React, { DragEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadSchema } from "../schema/upload.schema";
import { IUploadForm } from "../types/upload.types";

interface UploadFormProps {
  onSaveDraft?: (data: IUploadForm) => void;
  onContinue?: (data: IUploadForm) => void;
  onCancel?: () => void;
}

const UploadForm = ({ onSaveDraft, onContinue, onCancel }: UploadFormProps) => {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<IUploadForm>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
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

      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    if (formData.file && onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  const onSubmit = (data: IUploadForm) => {
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
        <div className="flex gap-4">
          <button
            className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1.5 text-sm font-medium text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
            onClick={handleSaveDraft}
            type="button"
            disabled={!watchedFile}
          >
            Save as draft
          </button>
          <Link href="/publish">
            <NavbarButton
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
              className="w-fit"
            >
              <button
                className="font-bebas relative inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-950 px-2.5 py-1.5 text-sm font-medium text-white capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
                onClick={() => {
                  if (watchedFile && watchedTitle) {
                    onSubmit({ file: watchedFile, title: watchedTitle });
                  }
                }}
                disabled={!watchedFile || !watchedTitle}
              >
                Continue
              </button>
            </NavbarButton>
          </Link>
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
                    className="font-helvetica placeholder:font-bebas bg-black/60 text-2xl text-white shadow-sm placeholder:text-lg placeholder:text-white focus-visible:shadow-none focus-visible:ring-0"
                    placeholder="Enter your artwork title..."
                    {...field}
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
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    {/* Upload Box */}
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      htmlFor="file-upload"
                      className={`flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed text-center transition-colors ${
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
                            <p className="font-grotesk text-sm text-white">
                              Click to change file
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <IconFileUpload className="mb-2 text-4xl text-gray-500" />
                          <p className="font-grotesk font-semibold text-gray-600">
                            Drag and drop an image, or{" "}
                            <span className="font-semibold text-blue-600 underline">
                              Browse
                            </span>
                          </p>
                          <p className="font-grotesk mt-2 text-sm text-gray-400">
                            Max 120mb each (25mb for videos)
                          </p>
                          <div className="font-grotesk mt-4 space-y-1 text-sm text-gray-500">
                            <p>- Only upload media you own the rights to</p>
                            <p>- Video (mp4)</p>
                            <p>- Upload high resolution images (png, jpg)</p>
                          </div>
                        </>
                      )}
                      <input
                        {...field}
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
            <div className="font-grotesk mt-6 text-center">
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
