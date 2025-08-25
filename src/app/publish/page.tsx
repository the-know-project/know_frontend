"use client";

import { useState } from "react";
import { ArtistGuard } from "@/src/features/auth/guards/OptimizedAuthGuard";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("/Art1.png"); // Default thumbnail

  const handleCheckbox = (cat: string) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <ArtistGuard>
      <div className="mx-auto max-w-7xl p-8">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <button className="text-sm text-gray-600">Cancel</button>
          <div className="space-x-2">
            <button className="btn btn-ghost border-gray-300">
              Save as draft
            </button>
            <button className="btn btn-primary">Publish Now</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Side (Title + Image) */}
          <div className="lg:col-span-2">
            <input
              className="mb-6 w-full border-b text-3xl font-semibold outline-none placeholder:text-gray-400"
              placeholder="Title of your project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="mb-6 w-full">
              <img
                src={thumbnail}
                alt="Uploaded Image"
                className="max-h-[500px] w-full rounded object-cover"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Insert Block (Basic Blocks) */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Insert Block</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>➕ Text</li>
                <li>🖼️ Image</li>
                <li>🎥 Video</li>
              </ul>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium">Tags</label>
              <input
                type="text"
                placeholder="Add tags..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            {/* Art Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Art Category
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Illustration",
                  "Drawing",
                  "Photography",
                  "Sculpture",
                  "Digital Art",
                  "Calligraphy",
                ].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={category.includes(cat)}
                      onChange={() => handleCheckbox(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Thumbnail</h4>
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="h-24 w-32 rounded border object-cover"
              />
              <p className="mt-1 text-xs text-gray-500">
                Crop/Select Thumbnail (coming soon)
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArtistGuard>
  );
}
