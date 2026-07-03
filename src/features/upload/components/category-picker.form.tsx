"use client";

import { useState } from "react";
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
  const [animatingCategory, setAnimatingCategory] = useState<string | null>(
    null,
  );

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];

    if (uploadData.categories.includes(category)) {
      newCategories = uploadData.categories.filter((cat) => cat !== category);
    } else {
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

  const categories = data?.data || [];

  return (
    <section className="editor_container">
      <div className="space-y-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category: string) => (
            <label
              key={category}
              className="flex cursor-pointer items-center space-x-3"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isCategorySelected(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-5 w-5 cursor-pointer rounded-[15px] accent-neutral-800"
                />
              </div>
              <span className="font-grotesk text-sm text-neutral-600 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPickerForm;
