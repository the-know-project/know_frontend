"use client";

import { useState } from "react";
import { useUploadContext } from "../context/upload-context";

interface CategoryPickerFormProps {
  onSaveDraft?: (category: string) => void;
}

const categories = [
  "Abstract",
  "Landscape",
  "Portrait",
  "Still Life",
  "Street Art",
  "Digital Art",
  "Photography",
  "Sculpture",
  "Mixed Media",
  "Contemporary",
  "Traditional",
  "Pop Art",
  "Minimalist",
  "Surreal",
  "Conceptual",
];

const CategoryPickerForm: React.FC<CategoryPickerFormProps> = ({ onSaveDraft }) => {
  const { uploadData, updateCategory } = useUploadContext();
  const [selectedCategory, setSelectedCategory] = useState(uploadData.category);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateCategory(category);
    if (onSaveDraft) {
      onSaveDraft(category);
    }
  };

  return (
    <section className="flex w-full flex-col rounded-md bg-neutral-700 px-4 py-4">
      <div className="space-y-3">
        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Selected Category Display */}
        {selectedCategory && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30">
            <div className="text-sm text-gray-300">Selected Category:</div>
            <div className="text-lg font-medium text-white">{selectedCategory}</div>
          </div>
        )}

        {/* Clear Selection */}
        {selectedCategory && (
          <button
            type="button"
            onClick={() => handleCategorySelect("")}
            className="w-full p-2 rounded-lg bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryPickerForm;