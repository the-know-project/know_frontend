/* pages/upload.tsx */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleContinue = () => {
    if (selectedFile) {
      router.push("/create");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl border border-dashed border-gray-300 rounded-xl p-10 text-center relative">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center cursor-pointer h-80"
        >
          <Image src="/upload-icon.svg" alt="Upload Icon" width={40} height={40} />
          <p className="mt-4 text-gray-600 text-lg font-medium">
            Drag and drop an image, or <span className="text-blue-500">Browse</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">Max 25mb each (.mp4 for videos)</p>
          <p className="text-sm text-gray-500">Only upload media you own the rights to</p>
          <p className="text-sm text-gray-500">Upload high resolution images (.png, .jpg)</p>
          <input
            type="file"
            accept="image/png, image/jpeg, video/mp4"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6 flex gap-4 w-full max-w-4xl justify-between">
        <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
        <div className="flex gap-4">
          <button className="btn btn-warning">Save as draft</button>
          <button className="btn btn-primary" onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}
