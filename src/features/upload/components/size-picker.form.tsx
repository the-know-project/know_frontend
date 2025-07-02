"use client";

import { useForm } from "react-hook-form";
import { SizePickerSchema } from "../schema/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { useState, useEffect, useRef } from "react";
import { ISizePickerForm } from "../types/upload.types";
import { useUploadContext } from "../context/upload-context";
import { ChevronDown, X } from "lucide-react";

interface SizePickerFormProps {
  onSaveDraft?: (data: ISizePickerForm) => void;
}

const DIMENSIONS = [
  { key: "width", label: "Width" },
  { key: "height", label: "Height" },
  { key: "depth", label: "Depth" },
  { key: "length", label: "Length" },
  { key: "weight", label: "Weight" },
  { key: "diameter", label: "Diameter" },
];

const UNITS = {
  dimension: ["cm", "in", "mm", "ft", "m"],
  weight: ["kg", "lb", "g", "oz"],
};

const SizePickerForm: React.FC<SizePickerFormProps> = ({ onSaveDraft }) => {
  const { uploadData, updateSizeInfo } = useUploadContext();
  const [savedDimensions, setSavedDimensions] = useState<{
    [key: string]: { value: number; unit: string };
  }>({});
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const form = useForm({
    resolver: zodResolver(SizePickerSchema),
    defaultValues: uploadData.size,
  });

  useEffect(() => {
    const initialSaved: { [key: string]: { value: number; unit: string } } = {};
    DIMENSIONS.forEach((dim) => {
      const value = uploadData.size?.[dim.key as keyof typeof uploadData.size];
      if (value !== undefined && value !== null && value !== "") {
        const unit =
          dim.key === "weight"
            ? uploadData.size?.weightUnit || "kg"
            : uploadData.size?.dimensionUnit || "cm";
        initialSaved[dim.key] = { value: Number(value), unit };
      }
    });
    setSavedDimensions(initialSaved);
  }, [uploadData.size]);

  const handleInputChange = (dimensionKey: string, value: string) => {
    if (!value || value.trim() === "" || isNaN(Number(value))) {
      return;
    }

    const numValue = Number(value);
    const currentUnit =
      savedDimensions[dimensionKey]?.unit ||
      (dimensionKey === "weight" ? "kg" : "cm");

    const newSavedDimensions = {
      ...savedDimensions,
      [dimensionKey]: { value: numValue, unit: currentUnit },
    };
    setSavedDimensions(newSavedDimensions);

    // Update form and context
    const updateData: any = { [dimensionKey]: numValue };
    if (dimensionKey === "weight") {
      updateData.weightUnit = currentUnit;
    } else {
      updateData.dimensionUnit = currentUnit;
    }

    form.setValue(dimensionKey as any, numValue);
    if (dimensionKey === "weight") {
      form.setValue("weightUnit", currentUnit);
    } else {
      form.setValue("dimensionUnit", currentUnit);
    }

    updateSizeInfo(updateData);

    if (onSaveDraft) {
      const allData = { ...uploadData.size, ...updateData };
      onSaveDraft(allData);
    }
  };

  const handleUnitChange = (dimensionKey: string, unit: string) => {
    if (savedDimensions[dimensionKey]) {
      const newSavedDimensions = {
        ...savedDimensions,
        [dimensionKey]: { ...savedDimensions[dimensionKey], unit },
      };
      setSavedDimensions(newSavedDimensions);

      // Update form and context
      const updateData: any = {};
      if (dimensionKey === "weight") {
        updateData.weightUnit = unit;
        form.setValue("weightUnit", unit);
      } else {
        updateData.dimensionUnit = unit;
        form.setValue("dimensionUnit", unit);
      }

      updateSizeInfo(updateData);

      if (onSaveDraft) {
        const allData = { ...uploadData.size, ...updateData };
        onSaveDraft(allData);
      }
    }
  };

  const handleRemoveDimension = (dimensionKey: string) => {
    const newSavedDimensions = { ...savedDimensions };
    delete newSavedDimensions[dimensionKey];
    setSavedDimensions(newSavedDimensions);

    // Update form and context
    const updateData: any = { [dimensionKey]: undefined };
    form.setValue(dimensionKey as any, undefined);
    updateSizeInfo(updateData);

    if (onSaveDraft) {
      const allData = { ...uploadData.size, ...updateData };
      onSaveDraft(allData);
    }
  };

  const toggleDropdown = (dimensionKey: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dimensionKey]: !prev[dimensionKey],
    }));
  };

  const getUnitOptions = (dimensionKey: string) => {
    return dimensionKey === "weight" ? UNITS.weight : UNITS.dimension;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key]!.contains(event.target as Node)
        ) {
          setOpenDropdowns((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="editor_container">
      <Form {...form}>
        <div className="space-y-3">
          {DIMENSIONS.map((dimension) => {
            const isActive = savedDimensions[dimension.key];
            const currentValue = isActive
              ? savedDimensions[dimension.key].value
              : "";
            const currentUnit = isActive
              ? savedDimensions[dimension.key].unit
              : dimension.key === "weight"
                ? "kg"
                : "cm";

            return (
              <div key={dimension.key} className="space-y-2">
                <label className="font-bricolage text-sm font-light text-neutral-800">
                  {dimension.label}
                </label>

                <div className="flex items-center gap-2">
                  {/* Input with integrated unit dropdown */}
                  <div className="relative flex-1 rounded-md border border-gray-300 bg-white">
                    <Input
                      type="number"
                      placeholder="0"
                      className="font-bricolage [appearance:textfield] rounded-[15px] border-0 bg-transparent pr-16 text-sm font-normal text-neutral-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      value={currentValue}
                      onChange={(e) =>
                        handleInputChange(dimension.key, e.target.value)
                      }
                    />

                    {/* Unit Dropdown inside input */}
                    <div
                      ref={(el) => {
                        dropdownRefs.current[dimension.key] = el;
                      }}
                      className="absolute top-0 right-3 h-full"
                    >
                      <button
                        type="button"
                        className="font-bricolage flex h-full w-fit items-center gap-1 bg-transparent px-3 text-neutral-800 uppercase"
                        onClick={() => toggleDropdown(dimension.key)}
                      >
                        {currentUnit}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            openDropdowns[dimension.key] ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openDropdowns[dimension.key] && (
                        <div className="absolute top-full right-0 z-10 mt-1 w-20 overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
                          {getUnitOptions(dimension.key).map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              className="font-bricolage font-bolf w-full px-3 py-2 text-left text-sm text-neutral-800 uppercase hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              onClick={() => {
                                handleUnitChange(dimension.key, unit);
                                setOpenDropdowns((prev) => ({
                                  ...prev,
                                  [dimension.key]: false,
                                }));
                              }}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  {/* {isActive && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDimension(dimension.key)}
                      className="p-2 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>
      </Form>
    </section>
  );
};

export default SizePickerForm;
