'use client';

import React, { useState, DragEvent } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Link from 'next/link';

const UploadPage = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      {/* Top Action Buttons */}
      <div className="w-full flex justify-between mb-6">
        <button className="btn btn-ghost">Cancel</button>
        <div className="flex gap-4">
          <button className="btn btn-warning">Save as draft</button>
          <Link href="/publish">
          <button className="btn btn-primary">Continue</button>
          
          </Link>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        Let the world see your magic!
      </h1>

      {/* Upload Box */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        htmlFor="file-upload"
        className={`w-full max-w-3xl h-96 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center transition-colors ${
          dragging ? 'border-primary bg-blue-50' : 'border-gray-300'
        }`}
      >
        <FaCloudUploadAlt className="text-4xl mb-2 text-gray-500" />
        <p className="text-gray-600">
          Drag and drop an image, or{' '}
          <span className="text-blue-600 font-semibold underline">Browse</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">Max 120mb each (25mb for videos)</p>
        <div className="mt-4 space-y-1 text-sm text-gray-500">
          <p>- Only upload media you own the rights to</p>
          <p>- Video (mp4)</p>
          <p>- Upload high resolution images (png, jpg)</p>
        </div>
        <input
          type="file"
          id="file-upload"
          accept="image/png, image/jpeg, video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Optional Preview */}
      {file && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Selected file:</p>
          <p className="text-base font-medium">{file.name}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
