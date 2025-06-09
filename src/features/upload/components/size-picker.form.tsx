"use client";

import { useForm } from "react-hook-form";
import { SizePickerSchema } from "../schema/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { useState } from "react";
import { ISizePickerForm } from "../types/upload.types";
import { useUploadContext } from "../context/upload-context";

interface SizePickerFormProps {
  onSaveDraft?: (data: ISizePickerForm) => void;
}

const SizePickerForm: React.FC<SizePickerFormProps> = ({ onSaveDraft }) => {
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const { uploadData, updateSizeInfo } = useUploadContext();

  const form = useForm({
    resolver: zodResolver(SizePickerSchema),
    defaultValues: uploadData.size,
  });

  const handleFieldChange = (fieldName: string, value: string) => {
    const newFilledFields = new Set(filledFields);
    if (value && value.trim() !== "") {
      newFilledFields.add(fieldName);
    } else {
      newFilledFields.delete(fieldName);
    }
    setFilledFields(newFilledFields);
  };

  const getFieldContainerClass = (fieldName: string) => {
    return filledFields.has(fieldName)
      ? "flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-300"
      : "flex items-center justify-between p-3 rounded-lg bg-gray-600 text-gray-300 transition-all duration-300";
  };
  
  const handleSaveSize = () => {
    const sizeData = form.getValues();
    updateSizeInfo(sizeData);
    if (onSaveDraft) {
      onSaveDraft(sizeData);
    }
  };

  return (
    <section className="flex w-full flex-col rounded-md bg-neutral-700 px-4 py-4">
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("width")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Width:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : undefined;
                        field.onChange(numValue);
                        updateSizeInfo({ width: numValue });
                        handleFieldChange("width", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("height")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Height:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : undefined;
                        field.onChange(numValue);
                        updateSizeInfo({ height: numValue });
                        handleFieldChange("height", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="depth"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("depth")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Depth:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : undefined;
                        field.onChange(numValue);
                        updateSizeInfo({ depth: numValue });
                        handleFieldChange("depth", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("length")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Length:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : undefined;
                        field.onChange(numValue);
                        updateSizeInfo({ length: numValue });
                        handleFieldChange("length", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("weight")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Weight:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : 0;
                        field.onChange(numValue);
                        updateSizeInfo({ weight: numValue });
                        handleFieldChange("weight", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diameter"
            render={({ field }) => (
              <FormItem>
                <div className={getFieldContainerClass("diameter")}>
                  <FormLabel className="min-w-[60px] text-sm font-medium">
                    Diameter:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="ml-3 border-none bg-transparent text-right focus:ring-0 focus:outline-none"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Number(value) : undefined;
                        field.onChange(numValue);
                        updateSizeInfo({ diameter: numValue });
                        handleFieldChange("diameter", value);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </section>
  );
};

export default SizePickerForm;
