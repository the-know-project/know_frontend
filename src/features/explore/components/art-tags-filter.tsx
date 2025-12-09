"use client";

import { useState } from "react";

interface ArtTagsFilterProps {
  tags: string[];
}

const ArtTagsFilter = ({ tags }: ArtTagsFilterProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    console.log("Tag clicked:", tag);
  };

  const isTagSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`font-bebas rounded-full border px-3 py-1 text-xs tracking-wider transition-colors duration-200 ${
              isTagSelected(tag)
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-gray-300 bg-neutral-300 text-neutral-700 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtTagsFilter;
