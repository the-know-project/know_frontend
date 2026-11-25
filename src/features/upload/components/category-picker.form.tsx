"use client";

import { useUploadContext } from "../context/upload-context";
import { useGetCategories } from "@/src/features/personalize/hooks";
import { Check } from "lucide-react";

interface CategoryPickerFormProps {
  onSaveDraft?: (categories: string[]) => void;
}

const CategoryPickerForm: React.FC<CategoryPickerFormProps> = ({
  onSaveDraft,
}) => {
  const { uploadData, updateCategories } = useUploadContext();
  const { data, isLoading } = useGetCategories();

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];

    if (isCategorySelected(category)) {
      newCategories = uploadData.categories.filter(
        (cat) => cat.toLowerCase() !== category.toLowerCase(),
      );
    } else {
      newCategories = [...uploadData.categories, category];
    }

    updateCategories(newCategories);
    if (onSaveDraft) {
      onSaveDraft(newCategories);
    }
  };

  const isCategorySelected = (category: string) =>
    uploadData.categories.some(
      (item) => item.toLowerCase() === category.toLowerCase(),
    );

  if (isLoading) {
    return (
      <section className="px-4 py-4 sm:px-5">
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl bg-neutral-100"
            />
          ))}
        </div>
      </section>
    );
  }

  const categories = data?.data || [];

  return (
    <section className="px-4 py-4 sm:px-5">
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {categories.map((category: string) => {
          const selected = isCategorySelected(category);

          return (
            <button
              key={category}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => handleCategoryToggle(category)}
              className={`font-grotesk flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium capitalize transition focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none sm:text-sm ${
                selected
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  selected
                    ? "border-white bg-white text-indigo-700"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
              <span className="truncate">{category}</span>
            </button>
          );
        })}
      </div>
      {categories.length === 0 && !isLoading && (
        <p className="font-grotesk text-sm text-neutral-500">
          No categories yet. Add the first one below.
        </p>
      )}
    </section>
  );
};

export default CategoryPickerForm;
