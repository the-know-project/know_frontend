"use client";

import { useState } from "react";

interface ArtTagsFilterProps {
  onTagSelect?: (tags: string[]) => void;
  selectedTags?: string[];
}

const ArtTagsFilter = ({
  onTagSelect,
  selectedTags: propSelectedTags = [],
}: ArtTagsFilterProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(propSelectedTags);

  // Sample tags based on the image
  const availableTags = [
    "fact cars",
    "advertising",
    "mercedes benz",
    "car",
    "automotive",
    "photography",
    "candid shots",
    "lagos photographers",
    "urban photography",
  ];

  const handleTagClick = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
    onTagSelect?.(updatedTags);
  };

  const isTagSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
              isTagSelected(tag)
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
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
