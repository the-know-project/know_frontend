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
  const [animatingTag, setAnimatingTag] = useState<string | null>(null);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !uploadData.tags.includes(tag.trim())) {
      const trimmedTag = tag.trim();
      const newTags = [...uploadData.tags, trimmedTag];
      updateTags(newTags);

      // Trigger animation
      setAnimatingTag(trimmedTag);
      setTimeout(() => setAnimatingTag(null), 600);

      if (onSaveDraft) {
        onSaveDraft(newTags);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = uploadData.tags.filter((tag) => tag !== tagToRemove);
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
    <section className="editor_container">
      <div className="space-y-4">
        {/* Tag Input */}
        <div className="flex items-center justify-between rounded-lg bg-neutral-600 p-3 text-white">
          <Input
            type="text"
            placeholder="Add tags... (press Enter)"
            className="placeholder:font-bricolage font-bricolage border border-white bg-transparent text-white placeholder:text-white"
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
                className={`font-bricolage flex transform items-center gap-2 rounded-full bg-gradient-to-r from-black to-orange-600 px-3 py-1 text-xs tracking-wide text-white transition-all duration-500 ${
                  animatingTag === tag
                    ? "scale-110 animate-pulse shadow-lg"
                    : "scale-100 hover:scale-105"
                } `}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full p-1 transition-colors hover:bg-white/20"
                >
                  <IconX width={12} height={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tag Count */}
        <div className="font-bebas text-xs text-orange-600">
          {uploadData.tags.length} tag{uploadData.tags.length !== 1 ? "s" : ""}{" "}
          added
        </div>
      </div>
    </section>
  );
};

export default TagPickerForm;
