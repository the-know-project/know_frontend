"use client";

import { useState } from "react";
import { useUploadContext } from "../context/upload-context";
import { Input } from "@/src/shared/ui/input";
import { IconX } from "@tabler/icons-react";
import { Tag } from "lucide-react";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleAddTag(inputValue);
    setInputValue("");
  };

  return (
    <section className="editor_container">
      <div className="space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            aria-label="Add a tag"
            placeholder="Type a keyword"
            className="placeholder:font-grotesk font-grotesk min-h-11 min-w-0 flex-1 rounded-xl border-neutral-200 bg-white text-sm text-neutral-700 placeholder:text-neutral-500 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="font-bebas min-h-11 rounded-xl bg-[#1E3A8A] px-4 text-sm tracking-wider text-white transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </form>

        {/* Display Tags */}
        {uploadData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadData.tags.map((tag, index) => (
              <div
                key={index}
                className={`font-bebas flex min-h-9 transform items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium tracking-wider text-neutral-700 capitalize transition-all duration-500 ${
                  animatingTag === tag
                    ? "scale-110 animate-pulse shadow-lg"
                    : "scale-100 hover:scale-105"
                } `}
              >
                <span className="inline-flex items-center gap-1">
                  <Tag
                    className="h-4 w-4 text-neutral-700"
                    aria-hidden="true"
                  />
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag} tag`}
                  className="rounded-full p-1 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
                >
                  <IconX className="h-4 w-4 text-neutral-700" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tag Count */}
        <div className="font-bebas text-xs text-neutral-800">
          {uploadData.tags.length} tag{uploadData.tags.length !== 1 ? "s" : ""}{" "}
          added
        </div>
      </div>
    </section>
  );
};

export default TagPickerForm;
