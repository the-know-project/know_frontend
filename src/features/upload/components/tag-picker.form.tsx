"use client";

import { useState } from "react";
import { useUploadContext } from "../context/upload-context";
import { Input } from "@/src/shared/ui/input";
import { IconX } from "@tabler/icons-react";

interface TagPickerFormProps {
  onSaveDraft?: (tags: string[]) => void;
}

const TagPickerForm: React.FC<TagPickerFormProps> = ({ onSaveDraft }) => {
  const { uploadData, updateTags } = useUploadContext();
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !uploadData.tags.includes(tag.trim())) {
      const newTags = [...uploadData.tags, tag.trim()];
      updateTags(newTags);
      if (onSaveDraft) {
        onSaveDraft(newTags);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = uploadData.tags.filter(tag => tag !== tagToRemove);
    updateTags(newTags);
    if (onSaveDraft) {
      onSaveDraft(newTags);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <section className="flex w-full flex-col rounded-md bg-neutral-700 px-4 py-4">
      <div className="space-y-4">
        {/* Tag Input */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-600 text-gray-300">
          <Input
            type="text"
            placeholder="Add tags... (press Enter)"
            className="border-none bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Display Tags */}
        {uploadData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <IconX width={12} height={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tag Count */}
        <div className="text-sm text-gray-400">
          {uploadData.tags.length} tag{uploadData.tags.length !== 1 ? 's' : ''} added
        </div>
      </div>
    </section>
  );
};

export default TagPickerForm;