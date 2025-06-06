"use client";

import { cn } from "@/lib/utils";
import { IconFilter } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import ArtSelectionSkeleton from "../../personalize/components/art-selection-skeleton";
import { DummyArtPreferences } from "../../personalize/data/personalize.data";
import { useGetCategories } from "../../personalize/hooks";

interface ExploreCategoriesProps {
  debounceMs?: number;
}

const useDebounce = (value: string[], delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ExploreCategories = ({
  debounceMs = 800,
}: ExploreCategoriesProps = {}) => {
  const { data, isLoading, error } = useGetCategories();
  const [activeButton, setActiveButton] = useState<"for-you" | "following">(
    "for-you",
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const debouncedPreferences = useDebounce(selectedPreferences, debounceMs);

  useEffect(() => {
    if (selectedPreferences.length > 0) {
      setIsProcessing(true);
    }
  }, [selectedPreferences]);

  const handlePreferencesChange = (preferences: string[]) => {
    console.log("User selected preferences:", preferences);
    // TODO: Replace with mutation hook later
    setIsProcessing(false);
  };

  useEffect(() => {
    if (debouncedPreferences.length > 0) {
      handlePreferencesChange(debouncedPreferences);
    } else if (debouncedPreferences.length === 0) {
      setIsProcessing(false);
    }
  }, [debouncedPreferences]);

  const handleSelection = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  };

  const isItemSelected = (pref: string) => {
    return selectedPreferences.includes(pref);
  };

  if (isLoading) {
    return <ArtSelectionSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Error fetching categories</div>;
  }
  const artPreferences = data ? data.data : DummyArtPreferences;

  return (
    <section className="relative z-50 flex w-full flex-col gap-1 sm:px-6">
      {/* Catgeories */}
      <div className="scrollbar-hide z-50 flex w-full overflow-x-auto sm:hidden">
        <div className="flex min-w-fit items-center gap-2">
          {artPreferences?.map((pref, index) => (
            <button
              key={index}
              className="motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit flex-shrink-0 rounded-md bg-black px-2 py-1 text-sm font-bold text-nowrap text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleSelection(pref)}
            >
              <p
                className={cn(
                  "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
                  isItemSelected(pref) && "text-neutral-700",
                )}
              >
                {pref}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {/* Following */}
        <div className="font-bebas motion-preset-expand motion-duration-700 motion-delay-700 relative flex items-center gap-2 tracking-wide">
          <div className="relative flex items-center rounded-lg bg-neutral-100 p-1">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 rounded-lg bg-black px-2 transition-all duration-300 ease-in-out ${
                activeButton === "for-you"
                  ? "left-1 w-[calc(50%-6px)]"
                  : "right-1 w-[calc(50%-2px)]"
              }`}
            />

            {/* Buttons */}
            <button
              onClick={() => setActiveButton("for-you")}
              className={`relative z-10 rounded-lg px-2 py-1 text-sm font-medium transition-colors duration-300 sm:px-4 sm:py-2 ${
                activeButton === "for-you"
                  ? "text-neutral-300"
                  : "text-neutral-700 hover:text-neutral-500"
              }`}
            >
              For you
            </button>

            <button
              onClick={() => setActiveButton("following")}
              className={`relative z-10 rounded-lg px-2 py-1 text-sm font-medium transition-colors duration-300 sm:px-4 sm:py-2 ${
                activeButton === "following"
                  ? "text-neutral-300"
                  : "text-neutral-700 hover:text-neutral-500"
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Catgeories */}
        <div className="scrollbar-hide z-50 hidden w-full max-w-[400px] overflow-x-auto sm:flex">
          <div className="flex min-w-fit items-center gap-2 px-4">
            {artPreferences?.map((pref, index) => (
              <button
                key={index}
                className="motion-duration-500 motion-preset-expand font-bebas group inline-flex w-fit flex-shrink-0 rounded-md bg-black px-2 py-1 text-sm font-bold text-nowrap text-white shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => handleSelection(pref)}
              >
                <p
                  className={cn(
                    "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
                    isItemSelected(pref) && "text-neutral-700",
                  )}
                >
                  {pref}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="motion-preset-expand motion-duration-700 motion-delay-700 flex w-fit gap-1 rounded-lg bg-black px-2 py-1 sm:px-4 sm:py-2">
          <IconFilter color="white" width={20} height={20} />
          <p className="font-bebas text-sm font-medium text-neutral-300">
            Filter
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
