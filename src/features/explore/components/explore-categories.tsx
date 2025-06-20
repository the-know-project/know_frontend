"use client";

import { cn } from "@/lib/utils";
import { ExploreFilters } from "@/src/constants/constants";
import { IconFilter2Edit } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import ArtSelectionSkeleton from "../../personalize/components/art-selection-skeleton";
import { DummyArtPreferences } from "../../personalize/data/personalize.data";
import { useGetCategories } from "../../personalize/hooks";

interface ExploreCategoriesProps {
  debounceMs?: number;
  onPreferencesChange?: (preferences: string[]) => void;
  onFiltersChange?: (filters: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  }) => void;
  selectedPreferences?: string[];
  selectedFilters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
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

const useFilterDebounce = (value: string[], delay: number) => {
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
  onPreferencesChange,
  onFiltersChange,
  selectedPreferences: propSelectedPreferences = [],
  selectedFilters: propSelectedFilters = {},
}: ExploreCategoriesProps = {}) => {
  const { data, isLoading, error } = useGetCategories();

  const [activeButton, setActiveButton] = useState<"for-you" | "following">(
    "for-you",
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    propSelectedPreferences,
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFilterProcessing, setIsFilterProcessing] = useState(false);
  const [isFilterToggled, setIsFilterToggled] = useState(false);
  const debouncedPreferences = useDebounce(selectedPreferences, debounceMs);
  const debouncedFilters = useFilterDebounce(selectedFilters, debounceMs);

  const handlePreferencesChange = useCallback(
    (preferences: string[]) => {
      console.log("User selected preferences:", preferences);
      if (preferences.length > 0) {
        onPreferencesChange?.(preferences);
      } else {
        onPreferencesChange?.([]);
      }
      setIsProcessing(false);
    },
    [onPreferencesChange],
  );

  const handleFiltersChange = useCallback(
    (filters: string[]) => {
      console.log("User selected filters:", filters);

      const filterObject: {
        priceMin?: number;
        priceMax?: number;
        sortBy?: "latest" | "oldest";
        available?: boolean;
      } = {};

      if (filters.length > 0) {
        filters.forEach((filterName) => {
          // Handle availability filters
          if (filterName === "For Sale") {
            filterObject.available = true;
          } else if (filterName === "Not For Sale") {
            filterObject.available = false;
          }

          // Handle sort filters
          else if (filterName === "Latest") {
            filterObject.sortBy = "latest";
          } else if (filterName === "Oldest") {
            filterObject.sortBy = "oldest";
          }

          // Handle price range filters
          else if (filterName === "$50 - $500") {
            filterObject.priceMin = 50;
            filterObject.priceMax = 500;
          } else if (filterName === "$501 - $1500") {
            filterObject.priceMin = 501;
            filterObject.priceMax = 1500;
          } else if (filterName === "$1500 - above") {
            filterObject.priceMin = 1500;
          }
        });
      }

      onFiltersChange?.(filterObject);
      setIsFilterProcessing(false);
    },
    [onFiltersChange],
  );

  useEffect(() => {
    if (selectedPreferences.length > 0) {
      setIsProcessing(true);
    }
  }, [selectedPreferences]);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      setIsFilterProcessing(true);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (debouncedPreferences.length > 0) {
      handlePreferencesChange(debouncedPreferences);
    } else if (debouncedPreferences.length === 0) {
      handlePreferencesChange([]);
      setIsProcessing(false);
    }
  }, [debouncedPreferences, handlePreferencesChange]);

  useEffect(() => {
    if (debouncedFilters.length > 0) {
      handleFiltersChange(debouncedFilters);
    } else if (debouncedFilters.length === 0) {
      handleFiltersChange([]);
    }
  }, [debouncedFilters, handleFiltersChange]);

  const handleSelection = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  };

  const handleFilterSelection = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId],
    );
  };

  const handleToggleFilter = () => {
    setIsFilterToggled((prev) => !prev);
  };

  const isItemSelected = (pref: string) => {
    return selectedPreferences.includes(pref);
  };

  const isFilterSelected = (filterId: string) => {
    return selectedFilters.includes(filterId);
  };

  const variants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { opacity: 1, y: 0, height: "auto" },
  };

  if (isLoading) {
    return <ArtSelectionSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Error fetching categories</div>;
  }
  const artPreferences = data ? data.data : DummyArtPreferences;

  return (
    <section className="relative flex w-full flex-col gap-2 sm:px-6">
      {/* Catgeories */}
      <div className="scrollbar-hide mb-2 flex w-full overflow-x-auto md:hidden">
        <div className="flex min-w-fit items-center gap-2">
          {artPreferences?.map((pref, index) => (
            <button
              key={index}
              className={`motion-duration-500 motion-preset-expand font-bricolage group inline-flex w-fit flex-shrink-0 rounded-md border !border-[#666666] px-2 py-1 text-sm font-normal text-nowrap text-black transition-all duration-300 hover:scale-110 active:scale-95 lg:text-[16px] ${isItemSelected(pref) && "bg-[#1E3A8A] text-white transition-all duration-100"} `}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleSelection(pref)}
            >
              <p
                className={cn(
                  "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
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
        <div className="font-bricolage motion-preset-expand motion-duration-700 motion-delay-700 relative flex items-center gap-2 tracking-wide">
          <div className="relative flex items-center rounded-lg bg-neutral-100 p-1">
            {/* Sliding background */}
            <div
              className={`absolute top-1 bottom-1 rounded-lg bg-[#1E3A8A] px-2 transition-all duration-300 ease-in-out ${
                activeButton === "for-you"
                  ? "left-1 w-[calc(50%-6px)]"
                  : "right-1 w-[calc(50%-2px)]"
              }`}
            />

            {/* Buttons */}
            <button
              onClick={() => setActiveButton("for-you")}
              className={`relative z-10 rounded-lg px-2 py-1 text-sm font-medium transition-colors duration-300 sm:px-4 sm:py-2 lg:text-[16px] ${
                activeButton === "for-you"
                  ? "text-neutral-300"
                  : "text-neutral-700 hover:text-neutral-500"
              }`}
            >
              For you
            </button>

            <button
              onClick={() => setActiveButton("following")}
              className={`relative z-10 rounded-lg px-2 py-1 text-sm font-medium transition-colors duration-300 sm:px-4 sm:py-2 lg:text-[16px] ${
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
        <div className="scrollbar-hide hidden w-full overflow-x-auto sm:max-w-[400px] md:flex lg:max-w-[900px]">
          <div className="flex min-w-fit items-center gap-2 px-4">
            {artPreferences?.map((pref, index) => (
              <button
                key={index}
                className={`motion-duration-500 motion-preset-expand font-bricolage group inline-flex w-fit flex-shrink-0 rounded-md border !border-[#666666] px-2 py-1 text-sm font-normal text-nowrap text-black transition-all duration-300 hover:scale-110 active:scale-95 lg:text-[16px] ${isItemSelected(pref) && "bg-[#1E3A8A] text-white transition-all duration-100"}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => handleSelection(pref)}
              >
                <p
                  className={cn(
                    "transition-all duration-200 group-hover:scale-105 group-active:scale-95",
                  )}
                >
                  {pref}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <button
          onClick={handleToggleFilter}
          className="motion-preset-expand motion-duration-700 motion-delay-700 border-[#666666text-black flex w-fit gap-1 rounded-lg border px-2 py-1 sm:px-4 sm:py-2"
        >
          <IconFilter2Edit color="black" width={20} height={20} />
          <p className="font-bricolage text-sm font-medium text-black lg:text-[16px]">
            Filter
          </p>
        </button>
      </div>

      {/* Filter Params */}
      <div className="overflow-hidden">
        <AnimatePresence>
          {isFilterToggled && (
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: 0.05,
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="scrollbar-hide flex w-full flex-row items-start justify-between gap-6 overflow-x-auto"
            >
              {ExploreFilters.map((ctx) => (
                <div
                  key={ctx.id}
                  className="flex flex-shrink-0 flex-col items-start"
                >
                  <h3 className="font-bricolage mb-2 text-sm font-medium text-neutral-700">
                    {ctx.name}
                  </h3>
                  <div className="flex items-center gap-[3px] sm:gap-2">
                    {ctx.filters.items.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => handleFilterSelection(item.name)}
                        className={cn(
                          "font-bricolage motion-preset-expand motion-duration-700 flex items-center gap-3 rounded-lg p-1 px-2.5 py-2 tracking-wide whitespace-nowrap transition-all duration-300",
                          isFilterSelected(item.name)
                            ? "bg-black text-white transition-all duration-200"
                            : "bg-neutral-300 text-black transition-all duration-200 hover:bg-neutral-400",
                        )}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <p className="hover-scale-105 text-[13px] transition-all duration-200 active:scale-95 sm:text-sm">
                          {item.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExploreCategories;
