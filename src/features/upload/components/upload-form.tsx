"use client";

import Spinner from "@/src/shared/components/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCheck,
  IconCloudDownload,
  IconFileUpload,
  IconX,
} from "@tabler/icons-react";
import React, { DragEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUploadContext } from "../context/upload-context";
import { UploadFormSchema } from "../schema/upload.schema";
import { IUploadFormState } from "../types/upload.types";
import { Settings2Icon } from "lucide-react";

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
  const [previews, setPreviews] = useState<
    { url: string; name: string; type: string; size: number }[]
  >([]);
  const { uploadData, updateBasicInfo, setIsEditorOpen } = useUploadContext();

  const form = useForm<IUploadFormState>({
    resolver: zodResolver(UploadFormSchema),
    defaultValues: {
      title: uploadData.title,
      files: uploadData.files || [],
    },
  });

  const watchedFiles = form.watch("files") || [];
  const watchedTitle = form.watch("title");

  // Sync previews with watchedFiles
  useEffect(() => {
    const urls = watchedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    setPreviews(urls);

    return () => {
      urls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [watchedFiles]);

  const handleDragOver = (e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const processFiles = (newFiles: FileList | File[]) => {
    const currentFiles = form.getValues("files") || [];
    const fileArray = Array.from(newFiles);

    // Add to current files, up to a maximum of 5 files
    const combined = [...currentFiles, ...fileArray].slice(0, 5);

    form.setValue("files", combined);
    form.trigger("files");
    updateBasicInfo({ files: combined });
    console.log(
      "Files updated:",
      combined.map((f) => f.name),
    );
  };

  const handleDrop = (e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues("files") || [];
    const updated = currentFiles.filter((_, i) => i !== index);
    form.setValue("files", updated);
    form.trigger("files");
    updateBasicInfo({ files: updated });
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    updateBasicInfo(formData);
    if (formData.files && formData.files.length > 0 && onSaveDraft) {
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

  return (
    <div className="flex min-h-screen w-full flex-col items-start px-6 py-10">
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
          {isPending ? (
            <Spinner borderColor="border-blue" />
          ) : (
            <button
              className="font-bebas relative z-10 rounded-lg bg-[#1E3A8A] px-2 py-1 text-sm font-normal tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 lg:text-[16px]"
              onClick={() => {
                if (watchedFiles.length > 0 && watchedTitle) {
                  const data: IUploadFormState = {
                    files: watchedFiles,
                    title: watchedTitle,
                  };
                  onSubmit(data);
                }
              }}
              disabled={watchedFiles.length === 0 || !watchedTitle}
            >
              <p className="flex">Continue</p>
            </button>
          )}

          <button
            onClick={() => setIsEditorOpen(true)}
            className="font-bebas relative z-10 rounded-lg bg-neutral-800 px-2 py-1 text-sm font-normal tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 lg:text-[16px]"
          >
            <Settings2Icon className="motion-preset-expand motion-duration-200 h-4 w-4 text-neutral-300" />
          </button>
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
                    className="font-grotesk placeholder:font-grotesk bg-transparent text-lg font-medium text-neutral-600 placeholder:text-lg placeholder:text-neutral-600 focus-visible:shadow-none focus-visible:ring-0"
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
            name="files"
            render={() => (
              <FormItem>
                <FormControl>
                  <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {watchedFiles.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex w-full flex-col items-center gap-4">
                          <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-x-visible sm:pb-0 md:grid-cols-3">
                            {previews.map((item, index) => (
                              <div
                                key={index}
                                className="group relative h-64 w-full flex-shrink-0 snap-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-900"
                              >
                                {item.type.startsWith("image/") ? (
                                  <img
                                    src={item.url}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : item.type.startsWith("video/") ? (
                                  <video
                                    src={item.url}
                                    className="h-full w-full object-cover"
                                    controls
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                                    <p className="truncate px-2 text-sm font-medium text-neutral-500">
                                      {item.name}
                                    </p>
                                  </div>
                                )}

                                {/* Number Badge (1-indexed order of files) */}
                                <div className="font-bebas absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-neutral-950/80 text-sm font-bold text-white backdrop-blur-sm">
                                  {index + 1}
                                </div>

                                {/* Remove Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                                  title="Remove file"
                                >
                                  <IconX width={16} height={16} />
                                </button>

                                {/* Hover Overlay */}
                                <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                  <p className="truncate text-xs font-semibold text-white">
                                    {item.name}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-neutral-300">
                                    {(item.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add More Slot if less than 5 */}
                          {watchedFiles.length < 5 && (
                            <label
                              htmlFor="file-upload"
                              className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-4 text-center transition-all hover:border-blue-500 hover:bg-neutral-50/5 ${
                                dragging ? "border-primary bg-blue-50/10" : ""
                              }`}
                            >
                              <IconFileUpload className="mb-2 text-3xl text-neutral-400" />
                              <p className="font-grotesk text-sm font-medium text-neutral-300">
                                Add file ({5 - watchedFiles.length} left)
                              </p>
                            </label>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Big Upload Box */
                      <label
                        htmlFor="file-upload"
                        className={`font-bricolage flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed text-center transition-colors ${
                          dragging
                            ? "border-primary bg-blue-50/10"
                            : "border-gray-300"
                        }`}
                      >
                        <IconFileUpload className="mb-2 text-4xl text-neutral-400" />
                        <p className="font-grotesk font-medium text-neutral-400">
                          Drag and drop up to 5 images/videos, or{" "}
                          <span className="text-blue-500 underline">
                            Browse
                          </span>
                        </p>
                        <p className="font-grotesk mt-2 text-sm font-light text-neutral-500">
                          Max 120mb each (25mb for videos)
                        </p>
                        <div className="font-grotesk mt-4 space-y-1 text-sm font-light text-neutral-500">
                          <p>- Only upload media you own the rights to</p>
                          <p>- Video (mp4)</p>
                          <p>- Upload high resolution images (png, jpg)</p>
                        </div>
                      </label>
                    )}

                    <input
                      type="file"
                      id="file-upload"
                      accept="image/png, image/jpeg, video/mp4"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </div>
                </FormControl>
                <FormMessage className="font-bebas self-center tracking-wider" />
              </FormItem>
            )}
          />

          {/* Files Summary */}
          {watchedFiles.length > 0 && (
            <div className="font-grotesk mt-6 text-center text-sm font-normal">
              <p className="text-sm font-medium text-neutral-400">
                Selected files ({watchedFiles.length}):
              </p>
              <div className="mt-2 flex flex-col items-center gap-1">
                {watchedFiles.map((file, i) => (
                  <p key={i} className="text-xs text-neutral-500">
                    {i + 1}.{" "}
                    <span className="font-medium text-neutral-400">
                      {file.name}
                    </span>{" "}
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                ))}
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
