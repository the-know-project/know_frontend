"use client";

import { useState } from "react";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("/Art1.png"); // Default thumbnail

  const handleCheckbox = (cat: string) => {
    setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <button className="text-sm text-gray-600">Cancel</button>
        <div className="space-x-2">
          <button className="btn btn-ghost border-gray-300">Save as draft</button>
          <button className="btn btn-primary">Publish Now</button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (Title + Image) */}
        <div className="lg:col-span-2">
          <input
            className="w-full text-3xl font-semibold border-b mb-6 outline-none placeholder:text-gray-400"
            placeholder="Title of your project"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="w-full mb-6">
            <img src={thumbnail} alt="Uploaded Image" className="w-full max-h-[500px] object-cover rounded" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Insert Block (Basic Blocks) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Insert Block</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>➕ Text</li>
              <li>🖼️ Image</li>
              <li>🎥 Video</li>
            </ul>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              placeholder="Add tags..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Art Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Art Category</label>
            <div className="flex flex-wrap gap-3">
              {['Illustration', 'Drawing', 'Photography', 'Sculpture', 'Digital Art', 'Calligraphy'].map(cat => (
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
            <h4 className="text-sm font-medium mb-2">Thumbnail</h4>
            <img src={thumbnail} alt="Thumbnail" className="w-32 h-24 object-cover rounded border" />
            <p className="text-xs text-gray-500 mt-1">Crop/Select Thumbnail (coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
