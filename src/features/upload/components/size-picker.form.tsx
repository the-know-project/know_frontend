"use client";

import { useForm } from "react-hook-form";
import { SizePickerSchema } from "../schema/upload.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { useState, useEffect, useRef } from "react";
import { ISizePickerForm } from "../types/upload.types";
import { useUploadContext } from "../context/upload-context";
import { Check, ChevronDown } from "lucide-react";
import {
  IconCheck,
  IconCircleCheck,
  IconCloudCheck,
} from "@tabler/icons-react";

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
  const [selectedDimension, setSelectedDimension] = useState("width");
  const [inputValue, setInputValue] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("cm");
  const [savedDimensions, setSavedDimensions] = useState<{
    [key: string]: { value: number; unit: string };
  }>({});
  const [animatingDimension, setAnimatingDimension] = useState<string | null>(
    null,
  );
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);
  const unitDropdownRef = useRef<HTMLDivElement>(null);
  const dimensionDropdownRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(SizePickerSchema),
    defaultValues: uploadData.size,
  });

  // Initialize saved dimensions from upload data
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

  // Update unit options when dimension changes
  useEffect(() => {
    const isWeight = selectedDimension === "weight";
    const defaultUnit = isWeight ? "kg" : "cm";
    setSelectedUnit(defaultUnit);

    // Load existing value if available
    if (savedDimensions[selectedDimension]) {
      setInputValue(savedDimensions[selectedDimension].value.toString());
      setSelectedUnit(savedDimensions[selectedDimension].unit);
    } else {
      setInputValue("");
    }
  }, [selectedDimension, savedDimensions]);

  const handleSave = () => {
    if (!inputValue || inputValue.trim() === "" || isNaN(Number(inputValue))) {
      return;
    }

    const numValue = Number(inputValue);

    // Update saved dimensions
    const newSavedDimensions = {
      ...savedDimensions,
      [selectedDimension]: { value: numValue, unit: selectedUnit },
    };
    setSavedDimensions(newSavedDimensions);

    // Trigger animation
    setAnimatingDimension(selectedDimension);
    setTimeout(() => setAnimatingDimension(null), 600);

    // Update form and context
    const updateData: any = { [selectedDimension]: numValue };
    if (selectedDimension === "weight") {
      updateData.weightUnit = selectedUnit;
    } else {
      updateData.dimensionUnit = selectedUnit;
    }

    form.setValue(selectedDimension as any, numValue);
    if (selectedDimension === "weight") {
      form.setValue("weightUnit", selectedUnit);
    } else {
      form.setValue("dimensionUnit", selectedUnit);
    }

    updateSizeInfo(updateData);

    if (onSaveDraft) {
      const allData = { ...uploadData.size, ...updateData };
      onSaveDraft(allData);
    }
  };

  const getUnitOptions = () => {
    return selectedDimension === "weight" ? UNITS.weight : UNITS.dimension;
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        unitDropdownRef.current &&
        !unitDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUnitDropdownOpen(false);
      }
      if (
        dimensionDropdownRef.current &&
        !dimensionDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDimensionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="editor_container">
      <Form {...form}>
        {/* Single Row Form */}
        <div className="flex w-full max-w-md items-center justify-between rounded-lg bg-neutral-600 p-3 text-white transition-all duration-300">
          {/* Custom Dimension Dropdown */}
          <div ref={dimensionDropdownRef} className="relative">
            <button
              type="button"
              className="upload_editor_button flex items-center gap-1"
              onClick={() =>
                setIsDimensionDropdownOpen(!isDimensionDropdownOpen)
              }
            >
              {DIMENSIONS.find((d) => d.key === selectedDimension)?.label}
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDimensionDropdownOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 w-fit overflow-hidden rounded-lg border border-orange-600 bg-black px-2 py-2 shadow-lg">
                {DIMENSIONS.map((dim) => (
                  <button
                    key={dim.key}
                    type="button"
                    className="font-bricolage w-full px-2.5 py-1.5 text-left text-sm font-bold whitespace-nowrap text-white uppercase transition-colors duration-150 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                    onClick={() => {
                      setSelectedDimension(dim.key);
                      setIsDimensionDropdownOpen(false);
                    }}
                  >
                    {dim.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Field */}
          <Input
            type="number"
            placeholder="0"
            className="upload_editor_input mx-2 w-20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInputKeyPress}
          />
        </div>

        <div className="mt-3 flex w-full max-w-md items-center justify-between rounded-lg bg-neutral-600 p-3 text-gray-300 transition-all duration-300">
          {/* Custom Unit Dropdown */}
          <div ref={unitDropdownRef} className="relative">
            <button
              type="button"
              className="upload_editor_button"
              onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
            >
              {selectedUnit}
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${isUnitDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isUnitDropdownOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
                {getUnitOptions().map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    className="font-grotesk w-full px-2.5 py-1.5 text-left text-sm font-bold text-white uppercase transition-colors duration-150 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                    onClick={() => {
                      setSelectedUnit(unit);
                      setIsUnitDropdownOpen(false);
                    }}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="ml-3 rounded-full bg-green-600 p-1 text-white transition-colors duration-200 hover:bg-green-500"
            disabled={!inputValue || inputValue.trim() === ""}
          >
            <IconCheck />
          </button>
        </div>

        {/* Animated Feedback Chips */}
        {Object.keys(savedDimensions).length > 0 && (
          <div className="mt-6 w-full">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {Object.entries(savedDimensions).map(
                ([dimKey, { value, unit }]) => {
                  const dimension = DIMENSIONS.find((d) => d.key === dimKey);
                  return (
                    <div
                      key={dimKey}
                      className={`font-bebas transform rounded-full bg-gradient-to-r from-black to-orange-600 px-2.5 py-1.5 text-xs font-bold text-white transition-all duration-500 ${
                        animatingDimension === dimKey
                          ? "scale-110 animate-pulse shadow-lg"
                          : "scale-100 hover:scale-105"
                      } `}
                    >
                      {dimension?.label}: {value} {unit}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </Form>
    </section>
  );
};

export default SizePickerForm;
