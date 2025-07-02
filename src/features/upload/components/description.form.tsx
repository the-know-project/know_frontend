"use client";

import { useState, useEffect } from "react";
import { useUploadContext } from "../context/upload-context";

interface DescriptionFormProps {
  onSaveDraft?: (description: string) => void;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({ onSaveDraft }) => {
  const { uploadData, updateDescription } = useUploadContext();
  const [localDescription, setLocalDescription] = useState(
    uploadData.description || "",
  );
  const maxWords = 250;

  const wordCount =
    localDescription.trim() === ""
      ? 0
      : localDescription.trim().split(/\s+/).length;

  useEffect(() => {
    setLocalDescription(uploadData.description || "");
  }, [uploadData.description]);

  const handleDescriptionChange = (value: string) => {
    const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    if (words > maxWords) {
      return;
    }

    setLocalDescription(value);
    updateDescription(value);

    if (onSaveDraft) {
      onSaveDraft(value);
    }
  };

  return (
    <section className="editor_container">
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder={`Add description (max ${maxWords} words)`}
            className="font-bricolage min-h-[120px] w-full resize-none rounded-md bg-white px-3 py-3 text-sm font-light text-neutral-800 placeholder-neutral-500 placeholder:font-light focus:border-gray-400 focus:ring-0 focus:outline-none"
          />

          {/* Word count indicator */}
          <div className="font-bricolage absolute right-3 bottom-2 text-xs text-neutral-500">
            {wordCount}/{maxWords} words
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionForm;
