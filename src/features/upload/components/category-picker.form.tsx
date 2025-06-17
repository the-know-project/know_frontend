"use client";

import { useState } from "react";
import { useUploadContext } from "../context/upload-context";
import { useGetCategories } from "@/src/features/personalize/hooks";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

interface CategoryPickerFormProps {
  onSaveDraft?: (categories: string[]) => void;
}

const CategoryPickerForm: React.FC<CategoryPickerFormProps> = ({
  onSaveDraft,
}) => {
  const { uploadData, updateCategories } = useUploadContext();
  const { data, isLoading, error } = useGetCategories();
  const [animatingCategory, setAnimatingCategory] = useState<string | null>(
    null,
  );

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];

    if (uploadData.categories.includes(category)) {
      // Remove category
      newCategories = uploadData.categories.filter((cat) => cat !== category);
    } else {
      // Add category with animation
      newCategories = [...uploadData.categories, category];
      setAnimatingCategory(category);
      setTimeout(() => setAnimatingCategory(null), 600);
    }

    updateCategories(newCategories);
    if (onSaveDraft) {
      onSaveDraft(newCategories);
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const newCategories = uploadData.categories.filter(
      (cat) => cat !== categoryToRemove,
    );
    updateCategories(newCategories);
    if (onSaveDraft) {
      onSaveDraft(newCategories);
    }
  };

  const isCategorySelected = (category: string) =>
    uploadData.categories.includes(category);

  if (isLoading) {
    return (
      <section className="editor_container">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-gray-600"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="editor_container">
        <div className="py-4 text-center text-red-500">
          Error loading categories. Please try again.
        </div>
      </section>
    );
  }

  const categories = data?.data || [];

  return (
    <section className="w-[350px] max-w-[500px] flex-col items-center justify-center self-center rounded-md bg-neutral-700 px-2 py-4 shadow-sm md:w-[200px] md:items-start md:justify-normal md:self-start lg:w-full">
      <div className="space-y-4">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {categories.slice(0, 31).map((category: string, index: number) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              className={cn(
                "font-bricolage group active:scale- inline-flex w-full rounded-lg px-2 py-2.5 text-sm font-bold text-wrap transition-all duration-300 hover:scale-105 md:w-full md:text-xs",
                isCategorySelected(category)
                  ? "bg-gradient-to-r from-black to-orange-600 text-white"
                  : "bg-neutral-600 text-white hover:bg-black",
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <p className="transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                {category}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Categories Display */}
        {uploadData.categories.length > 0 && (
          <div className="space-y-3">
            <div className="font-bebas text-sm text-gray-400">
              Selected Categories ({uploadData.categories.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadData.categories.map((category, index) => (
                <div
                  key={category}
                  className={`font-bebas flex transform items-center gap-2 rounded-full bg-gradient-to-r from-black to-orange-600 px-3 py-1.5 text-xs tracking-wide text-white transition-all duration-500 ${
                    animatingCategory === category
                      ? "scale-110 animate-pulse shadow-lg"
                      : "scale-100 hover:scale-105"
                  } `}
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="rounded-full p-1 transition-colors hover:bg-white/20"
                  >
                    <IconX width={10} height={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear All Button */}
        {uploadData.categories.length > 0 && (
          <button
            type="button"
            onClick={() => {
              updateCategories([]);
              if (onSaveDraft) {
                onSaveDraft([]);
              }
            }}
            className="font-grotesk w-full rounded-lg bg-red-600/20 p-2 text-sm text-red-400 transition-colors hover:bg-red-600/30"
          >
            Clear All Categories
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryPickerForm;
